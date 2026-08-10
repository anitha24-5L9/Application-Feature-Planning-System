from django.urls import path

from .views import checkout_demo


urlpatterns = [
    path(
        "checkout/<str:user_id>/",
        checkout_demo,
        name="checkout_demo"
    ),
]