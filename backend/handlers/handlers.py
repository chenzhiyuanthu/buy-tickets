import tornado.web


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie('user')


class MainHandler(BaseHandler):
    def get(self):
        print(self.get_current_user())
        self.write('hello world')


class LoginHandler(BaseHandler):
    def post(self):
        username = self.get_argument("username")
        password = self.get_argument("password")
        token = self.get_argument("token")

        if password and token:
            pass
        else:

        if username == password:
            self.set_secure_cookie("user", username)
            print(self.get_secure_cookie(username))
        else:
            self.set_status(status_code=401, reason="password incorrect")
