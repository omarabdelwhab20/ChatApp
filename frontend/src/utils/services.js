export const baseUrl = import.meta.env.VITE_BASE_URL


export const postRequest = async (url, body) =>{
    try {
        const response = await fetch(url, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body 
    })

        const data = await response.json()

        if(!response.ok){
            return {
                error : true,
                message : data.message || 'Request failed',
                status : response.status
            }
        }

        return data
    } catch (error) {
        return {
            error : true,
            message : error.message || 'Request failed',
        }
    }
}