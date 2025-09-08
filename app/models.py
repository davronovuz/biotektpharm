from django.db import models

class HeroSection(models.Model):
    title = models.CharField(max_length=255, verbose_name="Sarlavha")
    subtitle = models.TextField(verbose_name="Quyi matn")
    background = models.ImageField(upload_to="hero/", verbose_name="Fon rasmi")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title






class FeatureCard(models.Model):
    ICON_FA = 'fa'
    ICON_IMG = 'img'
    ICON_CHOICES = [
        (ICON_FA, 'Font Awesome class'),
        (ICON_IMG, 'Image/SVG upload'),
    ]

    title_uz = models.CharField(max_length=120)
    title_ru = models.CharField(max_length=120, blank=True, default='')
    title_en = models.CharField(max_length=120, blank=True, default='')

    text_uz = models.TextField()
    text_ru = models.TextField(blank=True, default='')
    text_en = models.TextField(blank=True, default='')

    icon_type = models.CharField(max_length=3, choices=ICON_CHOICES, default=ICON_FA)
    fa_class= models.CharField(max_length=64, blank=True, help_text="Masalan: 'fas fa-bullseye'")
    icon_image= models.ImageField(upload_to='feature_icons/', blank=True, null=True)

    order= models.PositiveIntegerField(default=0)
    is_active= models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title_uz










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
