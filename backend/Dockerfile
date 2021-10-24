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

RUN sed -i -E 's/name="memory" value=".+"/name="memory" value="8GiB"/g' /etc/ImageMagick-6/policy.xml
RUN sed -i -E 's/name="map" value=".+"/name="map" value="8GiB"/g' /etc/ImageMagick-6/policy.xml
RUN sed -i -E 's/name="area" value=".+"/name="area" value="8GiB"/g' /etc/ImageMagick-6/policy.xml
RUN sed -i -E 's/name="disk" value=".+"/name="disk" value="8GiB"/g' /etc/ImageMagick-6/policy.xml

RUN apt-get update && \
    apt-get -y install \
        poppler-utils \
        pdftk