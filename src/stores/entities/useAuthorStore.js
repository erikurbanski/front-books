import axios from "@/libs/axios.js";
import { defineStore } from "pinia";

const defaultState = {
    author: {},
    authors: [],
    loading: false,
};

export const useAuthorStore = defineStore({
    id: "authorStore",
    state: () => ({ ...defaultState }),
    getters: {
        getLoading: (state) => state.loading,
        getAuthor: (state) => state.author,
        getAuthors: (state) => state.authors,
    },
    actions: {
        async fetchAuthors() {
            this.loading = true;

            const response = await axios.get("/authors");
            const { data } = response;

            setTimeout(() => {
                if (data.meta.total) {
                    this.authors = data.data;
                }
                this.loading = false;
            }, 200);
        }
    },
});