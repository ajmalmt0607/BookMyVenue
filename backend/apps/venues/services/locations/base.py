from abc import ABC, abstractmethod


class BaseLocationService(ABC):

    @abstractmethod
    def search_locations(self, query: str):
        pass