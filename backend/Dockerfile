FROM yiisoftware/yii2-php:7.4-apache

RUN apt-get update && \
    apt-get -y --force-yes install \
        tesseract-ocr \
        tesseract-ocr-rus \
        libreoffice

RUN apt-get update && \
    apt-get -y install \
        imagemagick

RUN sed -i '/disable ghostscript format types/,+6d' /etc/ImageMagick-6/policy.xml