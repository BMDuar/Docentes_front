import { useState } from "react";

export default function CadastroDocentes() {
    const [docentes, setDocentes] = useState([]); // Lista de docentes
    const [formData, setFormData] = useState({
        id: "",
        matricula: "",
        nome: "",
        email: "",
        dataNascimento: "",
        dataAdmissao: "",
        situacao: "",
        areaConcurso: "",
        status: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Atualiza os campos do formulário
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Envia o formulário (salva ou edita um docente)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setDocentes(docentes.map(d => (d.id === formData.id ? formData : d)));
        } else {
            setDocentes([...docentes, { ...formData, id: Date.now().toString() }]);
        }
        resetForm();
    };

    // Preenche o formulário para edição
    const handleEdit = (docente) => {
        setFormData(docente);
        setIsEditing(true);
        setShowForm(true);
    };

    // Reseta o formulário
    const resetForm = () => {
        setFormData({
            id: "",
            matricula: "",
            nome: "",
            email: "",
            dataNascimento: "",
            dataAdmissao: "",
            situacao: "",
            areaConcurso: "",
            status: ""
        });
        setIsEditing(false);
        setShowForm(false);
    };

    return (
        <div className="container">
            <h1 style={{ color: "#532b88" }}>Cadastro de Docentes</h1>
            <button onClick={() => setShowForm(true)}>+ Novo</button>

            {showForm && (
                <div id="formContainer">
                    <h2>{isEditing ? "Editar Docente" : "Cadastrar Docente"}</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="matricula">Matrícula:</label>
                        <input type="text" id="matricula" value={formData.matricula} onChange={handleChange} required />

                        <label htmlFor="nome">Nome:</label>
                        <input type="text" id="nome" value={formData.nome} onChange={handleChange} required />

                        <label htmlFor="email">E-mail:</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} required />

                        <label htmlFor="dataNascimento">Data de Nascimento:</label>
                        <input type="date" id="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />

                        <label htmlFor="dataAdmissao">Data de Admissão:</label>
                        <input type="date" id="dataAdmissao" value={formData.dataAdmissao} onChange={handleChange} required />

                        <label htmlFor="situacao">Situação:</label>
                        <select id="situacao" value={formData.situacao} onChange={handleChange} required>
                            <option value="Estatutário">Estatutário</option>
                            <option value="CLT">CLT</option>
                        </select>

                        <label htmlFor="areaConcurso">Área do Concurso:</label>
                        <input type="text" id="areaConcurso" value={formData.areaConcurso} onChange={handleChange} required />

                        <label htmlFor="status">Status:</label>
                        <input type="text" id="status" value={formData.status} onChange={handleChange} required />

                        <button type="submit">{isEditing ? "Atualizar" : "Salvar"}</button>
                        <button type="button" onClick={resetForm}>Cancelar</button>
                    </form>
                </div>
            )}

            <table id="docentesTable">
                <thead>
                    <tr>
                        <th>Matrícula</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Data de Nascimento</th>
                        <th>Data de Admissão</th>
                        <th>Situação</th>
                        <th>Área do Concurso</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {docentes.map((docente) => (
                        <tr key={docente.id}>
                            <td>{docente.matricula}</td>
                            <td>{docente.nome}</td>
                            <td>{docente.email}</td>
                            <td>{docente.dataNascimento}</td>
                            <td>{docente.dataAdmissao}</td>
                            <td>{docente.situacao}</td>
                            <td>{docente.areaConcurso}</td>
                            <td>{docente.status}</td>
                            <td>
                                <button onClick={() => handleEdit(docente)}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
