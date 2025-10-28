import { Upload, Project } from "@/api/interface/index";
import { PORT1, PORT4 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/img`, params, { cancel: false });
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/video`, params, { cancel: false });
};

// 文件上传
export const uploadFile = (params: FormData) => {
  return http.post<Project.FileVo>(`/research-monitor/fileInfo/upload`, params, {
    cancel: false,
  });
};

// 文件下载
export const downloadFile = (id: number) => {
  return http.get(
    `/research-monitor/fileInfo/download/${id}`,
    {},
    { cancel: false, responseType: "blob" },
  );
};
