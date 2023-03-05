from typing import Any

from sqlalchemy import Column, Integer, String
from models.Base import Base


class Webhook(Base):
    __tablename__ = 'webhooks'

    id = Column(String, primary_key=True)
    plug_id = Column(String)
    user_id = Column(Integer, foreign_key=True)
    slug = Column(String)
    repository = Column(String)

    def __init__(self, id, plug_id, user_id, slug, repository):
        self.id = id
        self.plug_id = plug_id
        self.user_id = user_id
        self.slug = slug
        self.repository = repository