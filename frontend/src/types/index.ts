export interface IUploadZone {
    label: string,
    file: File | null,
    onClear: () => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}