import styled from "styled-components";
import Slider from "react-slick";
import { PageTemplateView } from "../components/templates/PageTemplateView";
import { useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../service/store/store";
import {
  clearViewFile,
  selectViewFile,
  setViewFile,
} from "../../service/store/file/fileViewSlice";
import { appConfig } from "../../config";
import { taskService } from "../../service/task/taskService";
import { useTitle } from "ahooks";

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const SliderWrapper = styled.div`
  width: 95%;
`;

const CompareContainer = styled.div`
  width: 100%;
  display: flex !important;
  column-gap: 10px;
  justify-content: space-around;
`;

const ImageWrapper = styled.div`
  width: 48%;
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
export const CompareViewPage: CT<unknown> = () => {
  const params = useParams<{ packageId: string; id: string; image: string }>();
  const viewFile = useAppSelector(selectViewFile);
  const refSlider = useRef(null);
  const dispatch = useAppDispatch();
  const history = useHistory();

  useTitle("Сравнение документов");

  useEffect(() => {
    return () => {
      dispatch(clearViewFile);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!refSlider || !viewFile) return;
    setTimeout(() => {
      //@ts-ignore
      refSlider.current.slickGoTo(Number(params.image - 1));
    }, 0);
    //eslint-disable-next-line
  }, [refSlider, viewFile, params.image]);

  useEffect(() => {
    if (!viewFile) {
      (async () => {
        try {
          const files = await taskService.view(Number(params.packageId));
          const data = files.data.files.find(
            (item) => item.id === Number(params.id)
          );
          if (data) {
            dispatch(setViewFile(data));
          } else {
            history.push(`/package/${params.packageId}`);
          }
        } catch (e) {
          history.push(`/package/${params.packageId}`);
        }
      })();
    }
    //eslint-disable-next-line
  }, [viewFile]);

  const path = appConfig.apiUrl;
  return (
    <PageTemplateView fullWidth={true}>
      {viewFile && (
        <Content>
          <SliderWrapper>
            {
              //@ts-ignore
              <Slider ref={refSlider} {...settings}>
                {new Array(viewFile.image_pages).fill(0).map((item, i) => (
                  <CompareContainer key={i}>
                    <ImageWrapper>
                      <img
                        src={`${path}file/image?id=${params.id}&page=${
                          Number(params.image) - 1
                        }`}
                        alt=""
                      />
                    </ImageWrapper>
                    <ImageWrapper>
                      <img
                        src={`${path}file/preview?id=${params.id}&page=${
                          Number(params.image) - 1
                        }`}
                        alt=""
                      />
                    </ImageWrapper>
                  </CompareContainer>
                ))}
              </Slider>
            }
          </SliderWrapper>
        </Content>
      )}
    </PageTemplateView>
  );
};
