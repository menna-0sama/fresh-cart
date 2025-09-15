import { useQuery } from "@tanstack/react-query";

export default function useQueryBrands(fn) {
    return  useQuery({
        queryKey : ['brands'], 
        queryFn : fn, 
        select : (data)=>data.data
    })
}
