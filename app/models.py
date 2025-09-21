from django.db import models




class ActiveQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)


class HeroSection(models.Model):

    title_uz    = models.CharField(max_length=255, verbose_name="Sarlavha (UZ)")
    title_ru    = models.CharField(max_length=255, blank=True, default="", verbose_name="Sarlavha (RU)")
    title_en    = models.CharField(max_length=255, blank=True, default="", verbose_name="Sarlavha (EN)")

    subtitle_uz = models.TextField(blank=True, default="", verbose_name="Quyi matn (UZ)")
    subtitle_ru = models.TextField(blank=True, default="", verbose_name="Quyi matn (RU)")
    subtitle_en = models.TextField(blank=True, default="", verbose_name="Quyi matn (EN)")

    background  = models.ImageField(upload_to="hero/", verbose_name="Fon rasmi")
    is_active   = models.BooleanField(default=True)

    objects = ActiveQuerySet.as_manager()

    def __str__(self):
        # tilga qaramay admin ro‘yxatda ko‘rinsin
        return self.title_uz or self.title_ru or self.title_en or "Hero"

    class Meta:
        verbose_name = "Hero bo‘limi"
        verbose_name_plural = "Hero bo‘limi"






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


# apps/about/models.py


ICON_TYPES = (
    ("fa", "Font Awesome class"),
    ("img", "Image file"),
)

class CompanyIntro(models.Model):
    # Tepadagi “BIOTEK PHARM haqida” qismi (1 dona yozuv)
    title_uz = models.CharField(max_length=200, default="BIOTEK PHARM haqida")
    title_ru = models.CharField(max_length=200, blank=True, null=True)
    title_en = models.CharField(max_length=200, blank=True, null=True)
    text_uz = models.TextField()
    text_ru = models.TextField(blank=True, null=True)
    text_en = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to="about/", blank=True, null=True)  # chapdagi katta rasm
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Kompaniya intro"
        verbose_name_plural = "Kompaniya intro"

    def __str__(self):
        return self.title_uz


class HistoryCard(models.Model):
    # “Bizning tarix” bo‘limidagi kartalar (istalgancha)
    order = models.PositiveIntegerField(default=0, help_text="Sort tartibi")
    year = models.CharField(max_length=32, blank=True, help_text="Masalan: 2005-yil")
    title_uz = models.CharField(max_length=250)
    title_ru = models.CharField(max_length=250, blank=True, null=True)
    title_en = models.CharField(max_length=250, blank=True, null=True)
    text_uz = models.TextField(blank=True, null=True)
    text_ru = models.TextField(blank=True, null=True)
    text_en = models.TextField(blank=True, null=True)

    icon_type = models.CharField(max_length=3, choices=ICON_TYPES, default="fa")
    fa_class = models.CharField(
        max_length=100, blank=True, null=True, help_text="fa-solid fa-hospital-alt"
    )
    icon_image = models.ImageField(upload_to="icons/", blank=True, null=True)

    photo = models.ImageField(upload_to="history/", blank=True, null=True)  # o‘ng/chapdagi rasm
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Tarix kartasi"
        verbose_name_plural = "Tarix kartalari"

    def __str__(self):
        return f"{self.year} — {self.title_uz[:40]}"

    @property
    def has_icon_img(self):
        return self.icon_type == "img" and self.icon_image






ICON_TYPE = (
    ("fa", "Font Awesome class orqali"),
    ("img", "Rasm (PNG/SVG) orqali"),
)

class ServiceCard(models.Model):
    """Xizmatlar kartkasi (figmadagi 6 ta blok)"""
    is_active   = models.BooleanField(default=True, help_text="Ko‘rsatish/berkitish")
    order       = models.PositiveIntegerField(default=1, help_text="Tartib raqami (1,2,3...) — kichik raqam oldin chiqadi")

    # Matnlar (3 til)
    title_uz    = models.CharField(max_length=120)
    title_ru    = models.CharField(max_length=120, blank=True)
    title_en    = models.CharField(max_length=120, blank=True)

    text_uz     = models.CharField(max_length=250, blank=True)
    text_ru     = models.CharField(max_length=250, blank=True)
    text_en     = models.CharField(max_length=250, blank=True)

    # Ikon (venta uslubidagi watermark uchun)
    icon_type   = models.CharField(max_length=3, choices=ICON_TYPE, default="fa",
                                   help_text="Belgi qaysi ko‘rinishda bo‘lsin")
    fa_class    = models.CharField(
        max_length=80, blank=True,
        help_text="Masalan: <b>fa-solid fa-truck</b> yoki <b>fas fa-warehouse</b>. "
                  "Agar rasm ishlatsangiz — bo‘sh qoldiring."
    )
    icon_image  = models.ImageField(
        upload_to="services/icons/", blank=True, null=True,
        help_text="PNG/SVG 256×256 atrofida, fon shaffof bo‘lsa yaxshi."
    )

    class Meta:
        ordering = ("order",)
        verbose_name = "Xizmat kartkasi"
        verbose_name_plural = "Xizmat kartkalari"

    def __str__(self):
        return f"{self.order}. {self.title_uz or 'Xizmat'}"


class PartnerCard(models.Model):
    """Hamkorlar logotiplari (grid + animatsiya)"""
    is_active   = models.BooleanField(default=True, help_text="Ko‘rsatish/berkitish")
    order       = models.PositiveIntegerField(default=1, help_text="Tartib raqami (1,2,3...) — kichik raqam oldin chiqadi")

    name_uz     = models.CharField("Nomi (UZ)", max_length=120)
    name_ru     = models.CharField("Nomi (RU)", max_length=120, blank=True)
    name_en     = models.CharField("Nomi (EN)", max_length=120, blank=True)

    logo        = models.ImageField(
        upload_to="partners/logos/",
        help_text="Hamkor logotipi (SVG yoki PNG, eng yaxshi: 320×160, fon shaffof)."
    )
    url         = models.URLField("Havola", blank=True,
                                  help_text="Hamkor vebsayti (ixtiyoriy). http(s) bilan.")
    # ixtiyoriy: kalta izoh
    note_uz     = models.CharField(max_length=160, blank=True, help_text="Ixtiyoriy qisqa izoh")
    note_ru     = models.CharField(max_length=160, blank=True)
    note_en     = models.CharField(max_length=160, blank=True)

    class Meta:
        ordering = ("order",)
        verbose_name = "Hamkor"
        verbose_name_plural = "Hamkorlar"

    def __str__(self):
        return f"{self.order}. {self.name_uz}"







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
