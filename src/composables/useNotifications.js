import Swal from "sweetalert2";

const swalConfig = (title, icon, toast = false) => ({
    title,
    icon,
    toast,
    position: toast ? 'top' : 'center',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    theme: 'auto'
});

export const useNotifications = () => {

    const showSuccess = (title, toast = true) => {
        Swal.fire(swalConfig(title, 'success', toast));
    }

    const showError = (title, text = '', toast = true) => {
        const config = swalConfig(title, 'error', toast);
        config.text = text;
        Swal.fire(config);
    }

    const showInfo = (title, toast = true) => {
        Swal.fire(swalConfig(title, 'info', toast));
    }
    
    const showLoading = (title = 'Cargando...') => {
        Swal.fire({
            title,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            theme: 'auto'
        })
    }

    const showConfirm = (title, confirmButtonText = 'Aceptar', cancelButtonText = 'Cancelar') => {
        return Swal.fire({
            title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            theme: 'auto'
        })
    }
    
    const close = () => {
        Swal.close();
    }

    return {
        showSuccess,
        showError,
        showInfo,
        showConfirm,
        showLoading,
        close
    }
}