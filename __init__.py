"""Route package for the API.

This package collects the individual routers for profiles, fiches and
export functionality. Each router is defined in its own module and
imported here for convenience when wiring up FastAPI.
"""

from . import profile, fiches, export  # noqa: F401