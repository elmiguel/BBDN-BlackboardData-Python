from Config import sfconcfg
SFCONFIG = sfconcfg
SECRET_KEY = 'SOME RANDOM LONG HASH/TOKEN HERE'
DEBUG = True
# Database Common
DATETIME = "%Y-%m-%d %H:%M:%S"
DATE = "%Y-%m-%d"
QUERY_REPO = 'https://api.github.com/repos/elmiguel/BBDN-BlackboardData-Queries/contents'
RAW_VARS_URL = 'https://raw.githubusercontent.com/elmiguel/BBDN-BlackboardData-Queries/master/{query_name}/variables.json'
RAW_SQL_URL = 'https://raw.githubusercontent.com/elmiguel/BBDN-BlackboardData-Queries/master/{query_name}/query.sql'
app_config = {
    'timeSpentInCollab': {
        'params': None,
        'config': {
            'outfile': './output/TimeSpentInCollab.csv',
            'index': False
        }
    },
    'timeSpentInLearn': {
        'params': {'year': '2020'},
        'config': {
            'outfile': './output/TimeSpentInLearn.csv',
            'index': False
        }
    },
    'currentVersion': {
        'params': None,
        'config': {
            'outfile': './output/Verify.csv',
            'index': False
        }
    },
    'activityEqualsSuccess': {
        'params': None,
        'config': {
            'outfile': './output/ActivityEqualsSuccess.csv',
            'index': False
        }
    },
    'instructorActivityByTermAlt': {
        'params': None,
        'config': {
            'outfile': './output/InstructorActivityByTermAlt.csv',
            'index': False
        }
    }
}
