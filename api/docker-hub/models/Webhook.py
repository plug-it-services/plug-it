from sqlalchemy import Column, Integer, String
from models.Base import Base


class Webhook(Base):
    __tablename__ = 'webhooks'

    id = Column(String, primary_key=True)
    user_id = Column(Integer, foreign_key=True)
    slug = Column(String)
    repository = Column(String)
