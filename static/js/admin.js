// Lógica del Panel de Administración Privado - Veeduría Ciudadana Cicuco Transparente

document.addEventListener('DOMContentLoaded', () => {
    initAdminTabs();
    initContractForm();
    initContractActions();
    initReportUpdates();
    initApproveReportModal();
    initSettingsForm();
});

// 1. Navegación de pestañas internas del Admin
function initAdminTabs() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            tabBtns.forEach(b => {
                b.classList.remove('bg-blue-900', 'text-white');
                b.classList.add('text-slate-600', 'hover:bg-slate-100');
            });
            btn.classList.add('bg-blue-900', 'text-white');
            btn.classList.remove('text-slate-600', 'hover:bg-slate-100');

            tabPanes.forEach(pane => {
                if (pane.id === target) {
                    pane.classList.remove('hidden');
                } else {
                    pane.classList.add('hidden');
                }
            });
        });
    });
}

// 2. Formulario para Subir / Crear Nuevo Contrato
function initContractForm() {
    const form = document.getElementById('admin-contract-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Publicando Contrato...';

        const formData = new FormData(form);

        try {
            const res = await fetch('/api/admin/contracts/create', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                alert('¡Contrato subido y publicado exitosamente en el catálogo público!');
                window.location.reload();
            } else {
                alert('Error al publicar contrato: ' + (data.error || 'Verifica los campos ingresados.'));
            }
        } catch (err) {
            console.error('Error al subir contrato:', err);
            alert('Error de conexión con el servidor.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
        }
    });
}

// 3. Acciones de Contratos (Editar / Eliminar)
function initContractActions() {
    // Eliminar contrato
    document.querySelectorAll('.btn-delete-contract').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = btn.dataset.id;
            const code = btn.dataset.code;
            if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el contrato ${code} del catálogo?`)) {
                try {
                    const res = await fetch(`/api/admin/contracts/${id}/delete`, {
                        method: 'POST'
                    });
                    const data = await res.json();
                    if (data.success) {
                        alert('Contrato eliminado.');
                        window.location.reload();
                    } else {
                        alert('Error al eliminar: ' + (data.error || 'Error desconocido'));
                    }
                } catch (err) {
                    console.error(err);
                    alert('Error al conectar con el servidor.');
                }
            }
        });
    });

    // Modal de edición rápida
    const editModal = document.getElementById('admin-edit-contract-modal');
    const closeEditBtn = document.getElementById('btn-close-edit-modal');
    const editForm = document.getElementById('admin-edit-contract-form');

    if (!editModal || !editForm) return;

    function closeEdit() {
        editModal.classList.add('hidden');
        editModal.classList.remove('flex');
    }

    if (closeEditBtn) closeEditBtn.addEventListener('click', closeEdit);

    document.querySelectorAll('.btn-edit-contract').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            try {
                const res = await fetch(`/api/contracts/${id}`);
                const c = await res.json();
                if (c) {
                    document.getElementById('edit-contract-id').value = c.id;
                    document.getElementById('edit-code').value = c.code;
                    document.getElementById('edit-title').value = c.title;
                    document.getElementById('edit-sector').value = c.sector;
                    document.getElementById('edit-entity').value = c.entity;
                    document.getElementById('edit-contractor').value = c.contractor;
                    document.getElementById('edit-amount').value = c.amount;
                    document.getElementById('edit-progress-phys').value = c.progress_physical;
                    document.getElementById('edit-progress-fin').value = c.progress_financial;
                    document.getElementById('edit-status').value = c.status;
                    document.getElementById('edit-status-type').value = c.status_type;
                    document.getElementById('edit-inspection').value = c.last_inspection || '';
                    document.getElementById('edit-summary').value = c.summary || '';
                    document.getElementById('edit-external-link').value = c.external_link || '';

                    editModal.classList.remove('hidden');
                    editModal.classList.add('flex');
                }
            } catch (err) {
                console.error(err);
                alert('No se pudo cargar la información del contrato.');
            }
        });
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-contract-id').value;
        const formData = new FormData(editForm);

        try {
            const res = await fetch(`/api/admin/contracts/${id}/edit`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('¡Contrato modificado exitosamente!');
                window.location.reload();
            } else {
                alert('Error al modificar: ' + (data.error || 'Verifica los campos'));
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión.');
        }
    });
}

// 4. Actualización de Estados de Denuncias
function initReportUpdates() {
    document.querySelectorAll('.report-update-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = form.dataset.reportId;
            const statusSelect = form.querySelector('select[name="status"]');
            const notesInput = form.querySelector('input[name="admin_notes"]');
            const submitBtn = form.querySelector('button[type="submit"]');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Guardando...';

            const formData = new FormData();
            formData.append('status', statusSelect.value);
            formData.append('admin_notes', notesInput.value);

            try {
                const res = await fetch(`/api/admin/reports/${id}/update`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    submitBtn.classList.remove('bg-blue-900');
                    submitBtn.classList.add('bg-emerald-600');
                    submitBtn.textContent = '¡Guardado!';
                    setTimeout(() => {
                        submitBtn.classList.remove('bg-emerald-600');
                        submitBtn.classList.add('bg-blue-900');
                        submitBtn.textContent = 'Actualizar Estado';
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    alert('Error al actualizar estado.');
                    submitBtn.disabled = false;
                }
            } catch (err) {
                console.error(err);
                alert('Error al conectar.');
                submitBtn.disabled = false;
            }
        });
    });
}

// 5. Configuración del Sistema (Correo y Contraseña)
function initSettingsForm() {
    const form = document.getElementById('admin-settings-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const res = await fetch('/api/admin/settings/update', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('¡Configuración actualizada con éxito!');
                window.location.reload();
            } else {
                alert('Error: ' + (data.error || 'No se pudo actualizar'));
            }
        } catch (err) {
            console.error(err);
            alert('Error al guardar ajustes.');
        }
    });
}

// 6. Modal de Aprobación de Denuncias para Catálogo de Obras
function initApproveReportModal() {
    const modal = document.getElementById('admin-approve-modal');
    const closeBtn = document.getElementById('btn-close-approve-modal');
    const form = document.getElementById('admin-approve-form');

    if (!modal || !form) return;

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.querySelectorAll('.btn-open-approve-modal').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            try {
                const res = await fetch(`/api/admin/reports/${id}/details`);
                const data = await res.json();
                if (data.success && data.report) {
                    const r = data.report;
                    document.getElementById('approve-report-id').value = r.id;
                    document.getElementById('approve-orig-code').textContent = r.code;
                    document.getElementById('approve-orig-location').textContent = r.location;
                    document.getElementById('approve-orig-citizen').textContent = r.is_anonymous ? 'Anónimo Protegido' : (r.citizen_name || 'Ciudadano');
                    
                    document.getElementById('approve-code').value = `OBR-${r.code}`;
                    document.getElementById('approve-title').value = r.subject;
                    
                    // Mapear categoría a sector
                    const sectorSelect = document.getElementById('approve-sector');
                    if (r.category.includes('Obra') || r.category.includes('Pavimentación')) {
                        sectorSelect.value = 'Infraestructura y Vías';
                    } else if (r.category.includes('PAE') || r.category.includes('Alimentación')) {
                        sectorSelect.value = 'Educación y Nutrición';
                    } else if (r.category.includes('Salud') || r.category.includes('Hospital')) {
                        sectorSelect.value = 'Salud Pública';
                    } else if (r.category.includes('Acueducto') || r.category.includes('Alcantarillado')) {
                        sectorSelect.value = 'Agua y Saneamiento';
                    }

                    document.getElementById('approve-summary').value = `Ubicación: ${r.location}\n\nHechos denunciados por la comunidad: ${r.description}`;

                    const evNotice = document.getElementById('approve-evidence-link-name');
                    if (r.evidence_file) {
                        evNotice.textContent = r.evidence_file;
                    } else {
                        evNotice.textContent = 'Sin archivo adjunto';
                    }

                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                }
            } catch (err) {
                console.error(err);
                alert('No se pudo cargar la información del reporte.');
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('approve-report-id').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Publicando en Catálogo...';

        const formData = new FormData(form);

        try {
            const res = await fetch(`/api/admin/reports/${id}/approve`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message || '¡Reporte aprobado y publicado exitosamente en el Catálogo de Obras!');
                window.location.reload();
            } else {
                alert('Error al aprobar: ' + (data.error || 'Error desconocido'));
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión con el servidor.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
        }
    });
}
