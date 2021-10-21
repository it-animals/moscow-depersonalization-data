import { PageTemplate } from "../components/templates/PageTemplate";
import styled from "styled-components";
import Slider from "react-slick";

import Image1 from "../../assets/anketa-uchastnika-nacionalnoj-motocikletnoj-federacii.jpeg";
import Image2 from "../../assets/images.png";
import Image3 from "../../assets/1547052708_kartinki-krasivye-priroda005.jpeg";
import Image4 from "../../assets/image_2021-10-19_13-38-17.png";
import Image5 from "../../assets/1547366815_1.jpeg";
import Image6 from "../../assets/image_2021-10-14_15-33-13.png";
import Image7 from "../../assets/multfilm_lyagushka_32117.jpeg";
import Image8 from "../../assets/tatu_na_kljuchice_devushki_malenkie_ptichki_big.jpeg";
import { PageTemplateView } from "../components/templates/PageTemplateView";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const SliderWrapper = styled.div`
  width: 95%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  & img {
    object-fit: contain;
    width: 100%;
  }
`;

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  swipe: false,
  slidesToShow: 1,
  slidesToScroll: 1,
};
export const ViewDocumentPage: CT<unknown> = () => {
  const params = useParams<{ id: string; image: string }>();

  const refSlider = useRef(null);

  useEffect(() => {
    if (!refSlider) return;
    console.log(params);
    //@ts-ignore
    refSlider.current.slickGoTo(Number(params.image - 1));
  }, [refSlider, params.image]);

  return (
    <PageTemplateView>
      <Content>
        <SliderWrapper>
          <Slider ref={refSlider} {...settings}>
            <ImageWrapper>
              <img src={Image1} alt="" />
            </ImageWrapper>
            <ImageWrapper>
              <img src={Image2} alt="" />
            </ImageWrapper>
            <ImageWrapper>
              <img src={Image3} alt="" />
            </ImageWrapper>
            <ImageWrapper>
              <img src={Image4} alt="" />
            </ImageWrapper>
            <ImageWrapper>
              <img src={Image5} alt="" />
            </ImageWrapper>
            <ImageWrapper>
              <img src={Image6} alt="" />
            </ImageWrapper>
            <ImageWrapper>
              <img src={Image7} alt="" />
            </ImageWrapper>
            <ImageWrapper>
              <img src={Image8} alt="" />
            </ImageWrapper>
          </Slider>
        </SliderWrapper>
      </Content>
    </PageTemplateView>
  );
};
