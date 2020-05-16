import { useUser } from "./authentication";

export const usePermissions = (users) => {
    const thisUser = useUser();
    const isOwner = thisUser?.sub === users?.owner?.id;
    const guests = users?.guests?.find(guest => guest.id === thisUser?.sub);
    return {
        isOwner: isOwner,
        canSubmitRecords: isOwner || guests?.canSubmitRecords,
        canEdit: isOwner || guests?.canEdit
    };
};