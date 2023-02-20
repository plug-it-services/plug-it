from sqlalchemy import Column, Integer, String, Text
from models.Base import Base


class Connection(Base):
    __tablename__ = 'connections'

    user_id = Column(Integer, primary_key=True)
    username = Column(String)
    token = Column(String)
    jwt = Column(Text)

    def __init__(self, user_id, username, token, jwt):
        self.user_id = user_id
        self.username = username
        self.token = token
        self.jwt = jwt

    def __repr__(self):
        return "Connection(user_id={0}, username={1}, token={2}, jwt={3})".format(
            self.user_id,
            self.username,
            self.token,
            self.jwt
        )

    def get_usernames(self):
        return self.username
