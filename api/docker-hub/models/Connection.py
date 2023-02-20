from sqlalchemy import Column, Integer, String
from models.Base import Base


class Connection(Base):
    __tablename__ = 'connections'

    user_id = Column(Integer, primary_key=True)
    username = Column(String)
    token = Column(String)
    jwt = Column(String)