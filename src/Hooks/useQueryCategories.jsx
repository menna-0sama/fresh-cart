import { useQuery } from "@tanstack/react-query";

export default function useQueryCategories(fn) {
    return useQuery(
        {
            queryKey : ['categories'], 
            queryFn : fn, 
            select: (data) => data.data, 
            
        }
    );
}
