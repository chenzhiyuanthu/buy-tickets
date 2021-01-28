import tornado.ioloop
import tornado.web
from handlers.handlers import MainHandler, LoginHandler
import base64
import os

if __name__ == "__main__":
    settings = {
            "cookie_secret": base64.b64encode(os.urandom(50)).decode('ascii')
    }
    application = tornado.web.Application({
        (r"/", MainHandler),
        (r"/login", LoginHandler)
    }, **settings)
    application.listen(8888)
    tornado.ioloop.IOLoop.current().start()
