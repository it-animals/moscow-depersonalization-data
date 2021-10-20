import { useAppSelector } from "../../../service/store/store";
import { selectPackage } from "../../../service/store/package/packageSlice";
import { Grid } from "@mui/material";
import { FileItem } from "../../components/fileItem/FileItem";

export const FileList: CT<unknown> = () => {
  const packageFiles = useAppSelector(selectPackage);

  if (!packageFiles) return <></>;
  return (
    <Grid
      container
      rowSpacing={5}
      columnSpacing={10}
      justifyContent={"flex-start"}
    >
      {packageFiles.files.map((item) => (
        <Grid item xs={3} key={item.id}>
          <FileItem item={item} />
        </Grid>
      ))}
    </Grid>
  );
};
