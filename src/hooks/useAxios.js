import axios from "@/libs/axios.js";

import { isRef, ref, unref, watchEffect } from "vue";

export function useAxios({ url, method, body = null, headers = null }) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  async function doFetch() {
    data.value = null;
    error.value = null;
    loading.value = true;

    if (body instanceof FormData && method === "PUT") {
      body.set("_method", "PUT");
      method = "POST";
    }

    const urlValue = unref(url);
    try {
      const response = await axios[method.toLowerCase()](
        urlValue,
        body,
        headers
      );

      if (response.status === 204) {
        data.value = {
          message: response.statusText,
        };
      } else {
        data.value = response.data;
      }
    } catch (e) {
      error.value = e.response.data.message;
    } finally {
      loading.value = false;
    }
  }

  if (isRef(url)) watchEffect(doFetch);
  else doFetch();

  return { data, error, loading, retry: doFetch };
}