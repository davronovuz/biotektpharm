from django.db import models


class Contact(models.Model):
    """
    Model to store contact information.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    message = models.TextField()

    def __str__(self):
        return f"{self.name} <{self.email}>"

    class Meta:
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"
