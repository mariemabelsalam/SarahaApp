import { roleEnum } from "../../DB/models/User.model.js";



export const endPoint = {
    restoreAccount : [roleEnum.admin],
    deleteAccount : [roleEnum.admin],
}