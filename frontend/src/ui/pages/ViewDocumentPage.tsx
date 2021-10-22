import { PageTemplate } from "../components/templates/PageTemplate";
import styled from "styled-components";
import Slider from "react-slick";
import { PageTemplateView } from "../components/templates/PageTemplateView";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../service/store/store";
import {
  clearViewFile,
  selectViewFile,
} from "../../service/store/file/fileViewSlice";
import { appConfig } from "../../config";

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
