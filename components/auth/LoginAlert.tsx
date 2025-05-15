import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LoginAlertProps {
    show: boolean;
    onClose: () => void;
    onLoginClick: () => void;
}

export default function LoginAlert({ show, onClose, onLoginClick }: LoginAlertProps) {
    return (
        <AlertDialog open={show}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Login Required</AlertDialogTitle>
                    <AlertDialogDescription>
                        You need to be logged in to perform this action.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onLoginClick}>Login</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
