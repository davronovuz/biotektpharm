from django.db import models

class HeroSection(models.Model):
    title = models.CharField(max_length=255, verbose_name="Sarlavha")
    subtitle = models.TextField(verbose_name="Quyi matn")
    background = models.ImageField(upload_to="hero/", verbose_name="Fon rasmi")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    message = models.TextField()

    def __str__(self):
        return f"{self.name} <{self.email}>"

    class Meta:
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"
