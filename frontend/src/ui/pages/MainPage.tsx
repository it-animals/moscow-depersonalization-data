import { PageTemplate } from "../components/templates/PageTemplate";
import {UploadFile} from "../features/UploadFile/UploadFile";
import styled from "styled-components";
import {Paper} from "@mui/material";

const UploadContainer = styled(Paper)`
  width: 100%;
  height: 540px;
  padding: 20px;
`


export const MainPage: CT<unknown> = () => {
  return <PageTemplate>
    <UploadContainer>
      <UploadFile/>
    </UploadContainer>
  </PageTemplate>;
};
