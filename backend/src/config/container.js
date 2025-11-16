// src/config/container.js

// Config
import { env } from "./env.js";

// HTTP clients (infra)
import { AlunoApiClient } from "../infra/http/AlunoApiClient.js";
import { DisciplinaApiClient } from "../infra/http/DisciplinaApiClient.js";
import { BibliotecaApiClient } from "../infra/http/BibliotecaApiClient.js";

// Services (infra → implementam ports)
import { AlunoService } from "../infra/services/AlunoService.js";
import { DisciplinaService } from "../infra/services/DisciplinaService.js"
import { BibliotecaService } from "../infra/services/BibliotecaService.js";

// Repositórios
import { PostgresMatriculaRepository } from "../infra/repositories/PostgresMatriculaRepository.js";
import { PostgresReservaRepository } from "../infra/repositories/PostgresReservaRepository.js";

// Domain services
import { MatriculaDomainService } from "../core/domain/services/MatriculaDomainService.js";
import { ReservaDomainService } from "../core/domain/services/ReservaDomainService.js";

// Use cases
import { MatricularDisciplinaUseCase } from "../core/usecases/MatricularDisciplinaUseCase.js";
import { CancelarMatriculaUseCase } from "../core/usecases/CancelarMatriculaUseCase.js";
import { ReservarLivroUseCase } from "../core/usecases/ReservarLivroUseCase.js";
import { CancelarReservaUseCase } from "../core/usecases/CancelarReservaUseCase.js";
import { ListarDisciplinasUseCase } from "../core/usecases/ListarDisciplinasUseCase.js";
import { ConsultarDiscenteUseCase } from "../core/usecases/ConsultarDiscenteUseCase.js";
import { ListarLivrosUseCase } from "../core/usecases/ListarLivrosUseCase.js";

// Controllers
import { DiscenteController } from "../adapters/controllers/DiscenteController.js";
import { DisciplinaController } from "../adapters/controllers/DisciplinaController.js";
import { BibliotecaController } from "../adapters/controllers/BibliotecaController.js";
import { SimulacaoController } from "../adapters/controllers/SimulacaoController.js";

/**
 * Composition Root / Container de Dependências
 */
export function construirContainer() {
  /* ========== Infra: ApiClients ========== */
  const alunoApiClient = new AlunoApiClient(env.ALUNO_API_BASE_URL);
  const disciplinaApiClient = new DisciplinaApiClient(env.DISCIPLINA_API_BASE_URL);
  const bibliotecaApiClient = new BibliotecaApiClient(env.BIBLIOTECA_API_BASE_URL);

  /* ========== Infra: Services ========== */
  const alunoService = new AlunoService(alunoApiClient);
  const disciplinaService = new DisciplinaService(disciplinaApiClient);
  const bibliotecaService = new BibliotecaService(bibliotecaApiClient);

  /* ========== Infra: Repositórios ========== */
  const matriculaRepository = new PostgresMatriculaRepository(); // mini_arquitetura.matricula_simulada
  const reservaRepository = new PostgresReservaRepository();     // mini_arquitetura.reserva_simulada + livro_cache

  /* ========== Domínio: Services ========== */
  const matriculaDomainService = new MatriculaDomainService();
  const reservaDomainService = new ReservaDomainService();

  /* ========== Use Cases ========== */
  const consultarDiscenteUseCase = new ConsultarDiscenteUseCase(alunoService);
  const listarDisciplinasUseCase = new ListarDisciplinasUseCase(disciplinaService);
  const listarLivrosUseCase = new ListarLivrosUseCase(bibliotecaService);

  const matricularDisciplinaUseCase = new MatricularDisciplinaUseCase(
    alunoService,
    disciplinaService,
    matriculaRepository,
    matriculaDomainService
  );

  const cancelarMatriculaUseCase = new CancelarMatriculaUseCase(matriculaRepository);

  const reservarLivroUseCase = new ReservarLivroUseCase(
    bibliotecaService,
    reservaRepository,
    reservaDomainService
  );

  const cancelarReservaUseCase = new CancelarReservaUseCase(reservaRepository);

  /* ========== Controllers ========== */
  const discenteController = new DiscenteController(
    consultarDiscenteUseCase,
    alunoService
  );
  const disciplinaController = new DisciplinaController(listarDisciplinasUseCase);
  const bibliotecaController = new BibliotecaController(listarLivrosUseCase);

  const simulacaoController = new SimulacaoController(
    matricularDisciplinaUseCase,
    cancelarMatriculaUseCase,
    reservarLivroUseCase,
    cancelarReservaUseCase
  );

  return {
    discenteController,
    disciplinaController,
    bibliotecaController,
    simulacaoController,
  };
}
