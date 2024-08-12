import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

export const useReviewStore = defineStore('review', () => {
    const reviews = ref([]);
    const url = import.meta.env.VITE_API_URL;

    const headers = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

    const fetchReviews = async (query: string) => {
        try {
            const res: any = (await axios.get(`${url}/review${query}`, headers)).data;
            reviews.value = res.data;
            return res.meta.total;
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchUserReviews = async () => {
        try {
            const data: any = (await axios.get(`${url}/review/user/${localStorage.getItem("user_id")}`, headers)).data;
            reviews.value = data;
        }
        catch (err) {
            console.log(err);
        }
    }

    const deleteReview = async (id: any) => {
        return await axios.delete(`${url}/review/${id}`, headers);
    }

    const createReview = async (data: any) => {
        return await axios.post(`${url}/review`, data, headers);
    }

    const editReview = async (data: any, id: any) => {
        return await axios.patch(`${url}/review/${id}`, data, headers);
    }

    return { reviews, fetchReviews, fetchUserReviews, deleteReview, createReview, editReview }
});
