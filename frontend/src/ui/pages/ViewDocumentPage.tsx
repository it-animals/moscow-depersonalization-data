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
import { useAppDispatch, useAppSelector } from "../../service/store/store";
import {
  clearViewFile,
  selectViewFile,
} from "../../service/store/file/fileViewSlice";
import { appConfig, isDev } from "../../config";

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
  lazyLoad: true,
  slidesToShow: 1,
  slidesToScroll: 1,
};
export const ViewDocumentPage: CT<unknown> = () => {
  const params = useParams<{ id: string; image: string }>();
  const viewFile = useAppSelector(selectViewFile);
  const refSlider = useRef(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearViewFile);
    };
  }, []);

  useEffect(() => {
    if (!refSlider || !viewFile) return;
    console.log(params);
    setTimeout(() => {
      //@ts-ignore
      refSlider.current.slickGoTo(Number(params.image - 1));
    }, 0);
  }, [refSlider, viewFile, params.image]);

  const path = appConfig.apiUrl;
  return (
    <PageTemplateView>
      {viewFile && (
        <Content>
          <SliderWrapper>
            {
              //@ts-ignore

              <Slider ref={refSlider} {...settings}>
                {new Array(viewFile.image_pages).fill(0).map((item, i) => (
                  <ImageWrapper key={i}>
                    <img
                      src={`${path}file/preview?id=${params.id}&page=${
                        Number(params.image) - 1
                      }`}
                      alt=""
                    />
                  </ImageWrapper>
                ))}
              </Slider>
            }
          </SliderWrapper>
        </Content>
      )}
    </PageTemplateView>
  );
};
