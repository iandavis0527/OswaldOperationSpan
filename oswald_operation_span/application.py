import argparse
import json
import pathlib

import cherrypy

from cherrypy_utils import url_utils
from cherrypy_utils.cherrypy_sqlalchemy_utils import SQLAlchemyTool, SQLAlchemyPlugin

from digital_deception_emulator.backend.database import Base
from digital_deception_emulator.backend.experiment.api import (
    ExperimentTestApi,
    ExperimentEventApi,
)
from digital_deception_emulator.backend.home.views import (
    HomeView,
    DashboardView,
    HeatmapView,
    PracticeView,
)
from digital_deception_emulator.backend.export.api import ExperimentExportApi
from digital_deception_emulator.backend.login.views import LoginView
from digital_deception_emulator.backend.configuration import (
    production_config,
    development_config,
    application_data,
)


def setup_server(subdomain="/digital-deception", shared_data_location=None, production=False):
    server_directory = pathlib.Path(__file__).parent.absolute()
    cherrypy.log("looking for digital deception assets at {0}".format(server_directory))
    template_location = server_directory.joinpath("frontend", "templates").resolve()
    api_key_filepath = server_directory.joinpath("backend", "configuration", "api.key")

    if not shared_data_location:
        shared_data_location = server_directory

    application_data.initialize(
        subdomain=subdomain,
        application_location=server_directory,
        shared_data_location=shared_data_location,
        template_location=template_location,
        api_key_filepath=api_key_filepath,
        produciton=production,
    )

    cherrypy._cpconfig.environments["production"]["log.screen"] = True

    if production:
        cherrypy.log("Using production configuration")
        active_file = production_config.get_config()
    elif not production:
        cherrypy.log("Using development configuration")
        active_file = development_config.get_config()

    cherrypy.config.update(active_file)

    cherrypy._cperror._HTTPErrorTemplate = cherrypy._cperror._HTTPErrorTemplate.replace(
        'Powered by <a href="http://www.cherrypy.org">CherryPy %(version)s</a>\n', ""
    )
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.tools.oswald_operation_database = SQLAlchemyTool("oswald_operation")

    cherrypy.tree.mount(HomeView(), subdomain, active_file)
    cherrypy.tree.mount(PracticeView(), url_utils.combine_url(subdomain, "practice"), active_file)
    cherrypy.tree.mount(LoginView(), url_utils.combine_url(subdomain, "login"), active_file)
    cherrypy.tree.mount(HeatmapView(), url_utils.combine_url(subdomain, "heatmap"), active_file)
    cherrypy.tree.mount(DashboardView(), url_utils.combine_url(subdomain, "dashboard"), active_file)
    cherrypy.tree.mount(ExperimentTestApi(), url_utils.combine_url(subdomain, "api", "test"), active_file)
    cherrypy.tree.mount(ExperimentEventApi(), url_utils.combine_url(subdomain, "api", "event"), active_file)
    cherrypy.tree.mount(ExperimentExportApi(), url_utils.combine_url(subdomain, "api", "export"), active_file)

    mysql_filepath = str(server_directory.joinpath("mysql.credentials").resolve())

    # mysql connection:
    # mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
    if production and mysql_filepath.exists():
        with open(mysql_filepath, "r") as mysql_credentials_file:
            credentials = json.load(mysql_credentials_file)
            connection_string = str("mysql+pymysql://{username}:{password}@{host}/{db_name}").format_map(credentials)
    else:
        cherrypy.log("Using sqlite database file in lieu of mysql credentials!")
        database_filepath = str(pathlib.Path(shared_data_location, "digital_deception.db").resolve())
        connection_string = "sqlite:///" + database_filepath

    SQLAlchemyPlugin(
        "oswald_operation",
        cherrypy.engine,
        Base,
        connection_string,
        echo=False,
        pool_recycle=20000,
    )

    cherrypy.log("Publishing db create for digital_deception")
    cherrypy.engine.publish("oswald_operation.db.create")


def run(subdomain="/digital-deception/ospan", production=False, shared_data_location=None, port=8080):
    old_mount_function = cherrypy.tree.mount

    def _monkey_mount(handler, url, config_file):
        cherrypy.log("Mounting URL {0}".format(url))
        old_mount_function(handler, url, config_file)

    cherrypy.tree.mount = _monkey_mount

    setup_server(subdomain=subdomain, shared_data_location=shared_data_location, production=production)

    cherrypy.log("setting server port to:" + str(port))
    cherrypy.config.update({"server.socket_port": port})

    cherrypy.engine.signals.subscribe()

    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Run the Operation Span web server")
    parser.add_argument("--subdomain", default="/digital-deception/rspan", help="The sub domain to mount the app at")
    parser.add_argument("--production", default=False, action="store_true", help="Enable production mode")
    parser.add_argument("--shared_data_location", help="The location of the root shared data folder")
    parser.add_argument("--port", type=int, help="The port to listen on", default=8080)
    args = parser.parse_args()
    run(
        subdomain=args.subdomain,
        production=args.production,
        shared_data_location=args.shared_data_location,
        port=args.port,
    )
