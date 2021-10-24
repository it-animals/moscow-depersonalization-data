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
  const history = useHistory();

  useEffect(() => {
    return () => {
      dispatch(clearViewFile);
    };
  }, []);

  useEffect(() => {
    if (!refSlider || !viewFile) return;
    setTimeout(() => {
      //@ts-ignore
      refSlider.current.slickGoTo(Number(params.image - 1));
    }, 0);
  }, [refSlider, viewFile, params.image]);

  useTitle("Просмотр документа");
  useEffect(() => {
    if (!viewFile) {
      (async () => {
        try {
          const files = await taskService.view(Number(params.id));
          const data = files.data.files.find(
            (item) => item.task_id === Number(params.id)
          );
          if (data) {
            dispatch(setViewFile(data));
          } else {
            history.push(`/package/${params.id}`);
          }
        } catch (e) {
          history.push(`/package/${params.id}`);
        }
      })();
    }
  }, [viewFile]);
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
