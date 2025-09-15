import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify';


export default function useMutationCart(fn) {
    
    let queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn : fn,
            onSuccess : ()=>{
                queryClient.invalidateQueries({
                    queryKey: ['cart']
                });
                
                toast.success('Product added to your cart successfully :D');
            } 

        }
    );
}
