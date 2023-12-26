import axios from "@/libs/axios.js";
import { defineStore } from "pinia";

const defaultState = {
  subject: {},
  subjects: [],
  loading: false,
};

export const useSubjectStore = defineStore({
  id: "subjectStore",
  state: () => ({ ...defaultState }),
  getters: {
    getLoading: (state) => state.loading,
    getSubject: (state) => state.subject,
    getSubjects: (state) => state.subjects,
  },
  actions: {
    async fetchSubjects() {
      this.loading = true;

      const response = await axios.get("/subjects");
      const { data } = response;

      setTimeout(() => {
        if (data.meta.total) {
          this.subjects = data.data;
        }
        this.loading = false;
      }, 200);
    }
  },
});