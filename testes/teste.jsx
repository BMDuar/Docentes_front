import { useState } from "react";
import "./outroteste.css"

export default function CadastroDocentes() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="container">
            <h1 style={{ color: "#532b88" }}>Cadastro de Docentes</h1>
            <button id="btnNovoDocente" onClick={() => setShowModal(true)}>+ Novo</button>
            <button id="btnEditar">
                <img src="C:/Users/37199/Downloads/pencilbranco.png" className="pencilEditar" alt="Editar" />
                Editar Docente
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Cadastrar Docente</h2>
                        <form>
                            <label htmlFor="matricula">Matrícula:</label>
                            <input type="text" id="matricula" required />

                            <label htmlFor="nome">Nome:</label>
                            <input type="text" id="nome" required />

                            <label htmlFor="email">E-mail:</label>
                            <input type="email" id="email" required />

                            <label htmlFor="dataNascimento">Data de Nascimento:</label>
                            <input type="date" id="dataNascimento" required />

                            <label htmlFor="dataAdmissao">Data de Admissão:</label>
                            <input type="date" id="dataAdmissao" required />

                            <label htmlFor="situacao">Situação:</label>
                            <select id="situacao" required>
                                <option value="Estatutário">Estatutário</option>
                                <option value="CLT">CLT</option>
                            </select>

                            <label htmlFor="areaConcurso">Área do Concurso:</label>
                            <input type="text" id="areaConcurso" required />

                            <label htmlFor="status">Status:</label>
                            <input type="text" id="status" required />

                            <button type="submit">Salvar</button>
                            <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
                        </form>
                    </div>
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
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}
