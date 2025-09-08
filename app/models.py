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




class ActiveQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)


def upload_about(instance, filename):
    return f"about/{filename}"


def upload_timeline(instance, filename):
    return f"timeline/{filename}"


class AboutSection(models.Model):
    """
    Bitta yozuv – sahifadagi “Kompaniya haqida” hero bloki.
    """
    # Overline (“Kompaniya haqida”)
    overline_uz = models.CharField(max_length=80, default="Kompaniya haqida")
    overline_ru = models.CharField(max_length=80, blank=True, default="")
    overline_en = models.CharField(max_length=80, blank=True, default="")

    # Sarlavha (ikki qatorga ajratib ishlatsak qulay)
    # 1-qator: brend nomi katta serifda (BIOTEKPHARM …)
    title_line1_uz = models.CharField(max_length=200, default="BIOTEKPHARM – bu xalqaro farmatsevtika mahsulotlarini")
    title_line1_ru = models.CharField(max_length=200, blank=True, default="")
    title_line1_en = models.CharField(max_length=200, blank=True, default="")

    # 2-qator: “yetkazib berish sohasida ishonchli hamkor”
    title_line2_uz = models.CharField(max_length=200, default="yetkazib berish sohasida ishonchli hamkor")
    title_line2_ru = models.CharField(max_length=200, blank=True, default="")
    title_line2_en = models.CharField(max_length=200, blank=True, default="")

    # Qisqa kirish matn (hero ostidagi paragraf)
    intro_uz = models.TextField(blank=True, default="")
    intro_ru = models.TextField(blank=True, default="")
    intro_en = models.TextField(blank=True, default="")

    # Chapdagi katta rasm (figmadagi shifokorlar surati)
    hero_image = models.ImageField(upload_to=upload_about, blank=True, null=True)

    # Yoqish/o‘chirish
    is_active = models.BooleanField(default=True)

    objects = ActiveQuerySet.as_manager()

    class Meta:
        verbose_name = "About (Hero) bo‘limi"
        verbose_name_plural = "About (Hero) bo‘limi"

    def __str__(self):
        return f"AboutSection: {self.overline_uz or 'About'}"


class TimelineItem(models.Model):
    """
    “Bizning tarix” – yil + sarlavha + matn + rasm + ikon (ixtiyoriy)
    """
    ICON_FA = 'fa'
    ICON_IMG = 'img'
    ICON_CHOICES = [
        (ICON_FA, "Font Awesome class"),
        (ICON_IMG, "Image/SVG upload"),
    ]

    year = models.CharField(max_length=20, help_text="Masalan: 2005-yil / 2012-yil / Bugun")
    title_uz = models.CharField(max_length=180)
    title_ru = models.CharField(max_length=180, blank=True, default="")
    title_en = models.CharField(max_length=180, blank=True, default="")

    text_uz = models.TextField(blank=True, default="")
    text_ru = models.TextField(blank=True, default="")
    text_en = models.TextField(blank=True, default="")

    # Katta rasm (cardning o‘ng tomoni)
    photo = models.ImageField(upload_to=upload_timeline, blank=True, null=True)

    # Kichik badge/ikon
    icon_type = models.CharField(max_length=3, choices=ICON_CHOICES, default=ICON_FA)
    fa_class = models.CharField(
        max_length=64,
        blank=True,
        help_text="Masalan: 'fa-solid fa-store' yoki 'fas fa-box-open'"
    )
    icon_image = models.ImageField(upload_to="timeline/icons/", blank=True, null=True)

    order = models.PositiveIntegerField(default=0, help_text="Kartalar tartibi (kichik – birinchi)")
    is_active = models.BooleanField(default=True)

    objects = ActiveQuerySet.as_manager()

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Timeline (tarix) elementi"
        verbose_name_plural = "Timeline (tarix) elementlari"

    def __str__(self):
        return f"{self.year} — {self.title_uz[:40]}"

    # Qulay localize helper (template’da ham ishlatish mumkin)
    def get_title(self, lang="uz"):
        return getattr(self, f"title_{lang}", None) or self.title_uz

    def get_text(self, lang="uz"):
        return getattr(self, f"text_{lang}", None) or self.text_uz









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
