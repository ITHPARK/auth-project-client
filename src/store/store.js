import create from 'zustand';

//클라이언트 로그인 상태관리
export const useLoggedState = create((set) => ({
    loggedState: false ,
    setLoggedState: (state) => set({loggedState: state}),
}))

export const useLoggedUser = create((set) => ({
    userid: "" ,
    setUser: (id) => set({userid: id}),
}))


