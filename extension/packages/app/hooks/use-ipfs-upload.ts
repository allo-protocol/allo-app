import { useMutation } from "@tanstack/react-query";

type IPFSContent = File | Record<string, unknown> | FormData;

export function useIpfsUpload() {
  return useMutation({
    mutationFn: async (data: IPFSContent) =>
      fetch(`/api/ipfs`, { method: "POST", body: toFormData(data) }).then((r) =>
        r.json()
      ),
  });
}

function toFormData(data: IPFSContent) {
  const formData = new FormData();

  if (!(data instanceof File)) {
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    data = new File([blob], "metadata.json");
  }

  formData.append("file", data);
  return formData;
}
