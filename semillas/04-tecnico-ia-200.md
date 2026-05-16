# Semilla 04 — Top 200 palabras técnicas de IA

> **Lo crítico:** las 200 palabras técnicas que aparecen en cualquier paper de IA, blog técnico, doc oficial. Sin ellas, lectura técnica B2-C1 se vuelve imposible.
> **Cuándo aprenderlas:** Fase 3 (mes 13+), tras AWL sublistas 1-3.
> **Tiempo:** 5 palabras/día × 4 días = 20/semana → 200 en 10 semanas.

---

## Cómo usar esta semilla

Cada palabra incluye:
- Inglés
- Traducción español
- Categoría
- Nivel CEFR sugerido
- 1 oración ejemplo del dominio real

---

## ARQUITECTURA DE MODELOS (40 palabras)

| EN | ES | Nivel | Ejemplo |
|----|-----|-------|---------|
| transformer | transformer | B2 | "The Transformer architecture replaced RNNs in NLP." |
| attention | atención | B2 | "Self-attention computes relationships between tokens." |
| self-attention | autoatención | B2 | "Self-attention is the core of transformers." |
| multi-head | multi-cabeza | B2 | "Multi-head attention captures different subspaces." |
| encoder | codificador | B2 | "The encoder processes the input sequence." |
| decoder | decodificador | B2 | "The decoder generates output autoregressively." |
| embedding | embedding (vector denso) | B2 | "Word embeddings capture semantic similarity." |
| token | token | B2 | "Each token is mapped to a 768-dim vector." |
| tokenizer | tokenizador | B2 | "BPE tokenizers handle rare words gracefully." |
| layer | capa | B1 | "GPT-3 has 96 layers." |
| residual connection | conexión residual | C1 | "Residual connections enable training deep networks." |
| skip connection | conexión de salto | C1 | "Skip connections preserve information." |
| feed-forward | feed-forward (hacia adelante) | B2 | "The feed-forward network expands then contracts." |
| activation | activación | B2 | "ReLU is the most common activation function." |
| ReLU | ReLU (sin traducción) | B2 | "ReLU outputs zero for negative inputs." |
| GELU | GELU | C1 | "GELU is used in modern transformers." |
| softmax | softmax | B2 | "Softmax normalizes logits to probabilities." |
| logit | logit | C1 | "Logits are pre-softmax outputs." |
| positional encoding | codificación posicional | C1 | "Positional encoding adds order information." |
| RoPE | RoPE (rotary positional embedding) | C2 | "RoPE generalizes better to long contexts." |
| LayerNorm | LayerNorm (normalización de capa) | C1 | "LayerNorm stabilizes training." |
| BatchNorm | BatchNorm | B2 | "BatchNorm normalizes across the batch dimension." |
| dropout | dropout | B2 | "Dropout prevents overfitting." |
| weight | peso | B1 | "Model weights are stored in safetensors format." |
| bias | sesgo | B2 | "Linear layers have weights and bias terms." |
| parameter | parámetro | B2 | "GPT-4 has hundreds of billions of parameters." |
| dimension | dimensión | B2 | "The hidden dimension is 4096." |
| hidden state | estado oculto | C1 | "The hidden state propagates through layers." |
| context window | ventana de contexto | B2 | "Llama 3 supports a 128k context window." |
| sequence | secuencia | B1 | "Input sequences are padded to fixed length." |
| autoregressive | autoregresivo | C1 | "Autoregressive models generate one token at a time." |
| sequence-to-sequence | secuencia a secuencia | C1 | "Seq2seq tasks include translation and summarization." |
| generative | generativo | B2 | "Generative models produce new content." |
| discriminative | discriminativo | C1 | "Discriminative models classify rather than generate." |
| pretrained | preentrenado | B2 | "Pretrained models accelerate downstream tasks." |
| foundation model | modelo fundacional | C1 | "Foundation models like GPT-4 are versatile." |
| instruction-tuned | ajustado a instrucciones | C1 | "Instruction-tuned models follow user requests." |
| chat-tuned | ajustado a chat | C1 | "Chat-tuned variants handle multi-turn conversations." |
| base model | modelo base | B2 | "The base model is then fine-tuned." |
| MoE / Mixture of Experts | mezcla de expertos | C2 | "MoE models activate only a subset of parameters." |

## ENTRENAMIENTO Y OPTIMIZACIÓN (40)

| EN | ES | Nivel | Ejemplo |
|----|-----|-------|---------|
| training | entrenamiento | B1 | "Training takes thousands of GPU hours." |
| inference | inferencia | B2 | "Inference latency must be under 200ms." |
| gradient | gradiente | B2 | "Gradients flow backward through the network." |
| backpropagation | retropropagación | C1 | "Backpropagation computes gradients efficiently." |
| optimizer | optimizador | B2 | "Adam is the most popular optimizer." |
| learning rate | tasa de aprendizaje | B2 | "A learning rate of 1e-4 is typical." |
| schedule | programa, calendario | B1 | "We use a cosine learning rate schedule." |
| warmup | calentamiento | C1 | "Warmup gradually increases the learning rate." |
| batch | lote | B1 | "Each batch contains 32 examples." |
| batch size | tamaño de lote | B1 | "Larger batch sizes stabilize training." |
| mini-batch | mini-lote | B2 | "We process the data in mini-batches." |
| epoch | época | B2 | "The model converges after 3 epochs." |
| iteration | iteración | B2 | "Each iteration updates the parameters." |
| step | paso | A2 | "After 10,000 training steps..." |
| loss | pérdida | B2 | "The training loss decreases steadily." |
| objective | objetivo (función) | B2 | "The objective function is cross-entropy." |
| cross-entropy | entropía cruzada | C1 | "Cross-entropy is standard for classification." |
| MSE / mean squared error | error cuadrático medio | B2 | "MSE penalizes large errors heavily." |
| regularization | regularización | C1 | "L2 regularization prevents overfitting." |
| weight decay | decaimiento de pesos | C1 | "Weight decay is a form of regularization." |
| convergence | convergencia | C1 | "The model reaches convergence after 24 hours." |
| diverge | divergir | C1 | "If the learning rate is too high, training diverges." |
| overfit | sobreajustarse | B2 | "Small datasets cause overfitting." |
| underfit | subajustarse | C1 | "Underfitting indicates insufficient capacity." |
| validation | validación | B2 | "We hold out 10% for validation." |
| test set | conjunto de prueba | B2 | "Final accuracy on the test set is 92%." |
| split | división | B1 | "We use an 80-10-10 train-val-test split." |
| augmentation | aumento (de datos) | C1 | "Data augmentation improves robustness." |
| pretraining | preentrenamiento | C1 | "Pretraining uses unlabeled web text." |
| fine-tuning | ajuste fino | B2 | "Fine-tuning adapts the model to a domain." |
| LoRA | LoRA | C2 | "LoRA fine-tunes only a small subset of weights." |
| QLoRA | QLoRA | C2 | "QLoRA enables fine-tuning on consumer GPUs." |
| adapter | adaptador | C1 | "Adapters add trainable layers without changing the base." |
| transfer learning | aprendizaje por transferencia | C1 | "Transfer learning leverages pretrained knowledge." |
| RLHF | RLHF (reinforcement learning from human feedback) | C2 | "RLHF aligns models with human preferences." |
| DPO | DPO (direct preference optimization) | C2 | "DPO is simpler than RLHF." |
| reward model | modelo de recompensa | C2 | "The reward model scores response quality." |
| preference data | datos de preferencia | C1 | "Preference data pairs ranked outputs." |
| supervised | supervisado | B2 | "Supervised fine-tuning uses labeled examples." |
| self-supervised | autosupervisado | C1 | "Self-supervised learning is the basis of pretraining." |

## INFERENCIA Y GENERACIÓN (30)

| EN | ES | Nivel | Ejemplo |
|----|-----|-------|---------|
| generation | generación | B1 | "Text generation requires careful sampling." |
| sampling | muestreo | C1 | "Different sampling strategies affect output." |
| greedy | codicioso | B2 | "Greedy decoding always picks the most likely token." |
| beam search | búsqueda en haz | C1 | "Beam search explores multiple candidates." |
| temperature | temperatura | B1 | "Higher temperature produces more creative outputs." |
| top-k | top-k | B2 | "Top-k sampling restricts to the k most likely tokens." |
| top-p / nucleus | top-p / núcleo | C1 | "Top-p (nucleus) sampling is more adaptive than top-k." |
| stop token | token de parada | B2 | "Generation stops at the EOS token." |
| EOS | EOS (end-of-sequence) | C1 | "The model emits EOS to terminate." |
| BOS | BOS (beginning-of-sequence) | C1 | "BOS marks the start of input." |
| prompt | prompt (consigna) | A2 | "A well-crafted prompt is critical." |
| zero-shot | zero-shot (sin ejemplos) | B2 | "Zero-shot performance is impressive." |
| few-shot | few-shot (con pocos ejemplos) | B2 | "Few-shot prompts include 3-5 examples." |
| chain of thought (CoT) | cadena de pensamiento | C1 | "Chain of thought improves reasoning." |
| context | contexto | B1 | "The model uses prior context to predict next tokens." |
| token-by-token | token por token | C1 | "Generation is token-by-token autoregressive." |
| latency | latencia | B2 | "Inference latency is critical for UX." |
| throughput | rendimiento (tokens/segundo) | C1 | "vLLM achieves higher throughput than naive serving." |
| TTFT | TTFT (time to first token) | C2 | "TTFT measures responsiveness." |
| streaming | streaming (en flujo) | B2 | "Streaming reduces perceived latency." |
| KV cache | KV cache | C1 | "KV cache avoids recomputing attention." |
| paged attention | paged attention | C2 | "Paged attention enables continuous batching." |
| continuous batching | continuous batching | C2 | "Continuous batching maximizes GPU utilization." |
| speculative decoding | decodificación especulativa | C2 | "Speculative decoding doubles generation speed." |
| draft model | modelo borrador | C2 | "A small draft model proposes tokens." |
| hallucination | alucinación | B2 | "Hallucinations are confident but incorrect outputs." |
| grounded | aterrizado, fundamentado | C1 | "Grounded responses cite sources." |
| RAG | RAG (retrieval-augmented generation) | C1 | "RAG retrieves relevant context before generation." |
| retrieval | recuperación | B2 | "Retrieval finds the most similar documents." |
| reranker | reranqueador | C2 | "A reranker improves retrieval quality." |

## CUANTIZACIÓN Y HARDWARE (30)

| EN | ES | Nivel | Ejemplo |
|----|-----|-------|---------|
| precision | precisión | B2 | "FP32 precision is rarely needed for inference." |
| FP32 / single-precision | precisión simple | B2 | "FP32 uses 32 bits per number." |
| FP16 / half-precision | precisión media | B2 | "FP16 halves memory usage." |
| BF16 | BF16 (bfloat16) | C1 | "BF16 has the range of FP32 with less precision." |
| INT8 | INT8 | B2 | "INT8 quantization reduces memory by 4x." |
| INT4 | INT4 | C1 | "INT4 enables running 70B models on consumer hardware." |
| quantization | cuantización | B2 | "Quantization compresses models with minor quality loss." |
| dequantization | descuantización | C1 | "Dequantization restores higher precision for compute." |
| GGUF | GGUF (formato) | C1 | "GGUF is the standard format for llama.cpp." |
| GGML | GGML (predecesor de GGUF) | C2 | "GGML was deprecated in favor of GGUF." |
| AWQ | AWQ (activation-aware quantization) | C2 | "AWQ preserves outliers in activations." |
| GPTQ | GPTQ | C2 | "GPTQ uses Hessian information for quantization." |
| EXL2 | EXL2 | C2 | "EXL2 is fast on NVIDIA GPUs." |
| VRAM | VRAM | B2 | "70B models need at least 40GB VRAM in 4-bit." |
| RAM | RAM | A2 | "CPU inference uses system RAM." |
| bandwidth | ancho de banda | B2 | "Memory bandwidth limits inference speed on CPU." |
| memory-bound | limitado por memoria | C1 | "Inference is memory-bound, not compute-bound." |
| compute-bound | limitado por cómputo | C1 | "Training is compute-bound on modern hardware." |
| GPU | GPU | A2 | "NVIDIA GPUs dominate ML workloads." |
| CPU | CPU | A2 | "CPU inference is slower but more accessible." |
| TPU | TPU | C1 | "TPUs are Google's custom AI accelerators." |
| accelerator | acelerador | B2 | "Hardware accelerators speed up training significantly." |
| offloading | offloading (descarga a CPU/disco) | C1 | "Offloading layers to CPU saves VRAM at speed cost." |
| inference engine | motor de inferencia | C1 | "vLLM is a popular inference engine." |
| serving | servir | B2 | "Production serving requires high throughput." |
| batch inference | inferencia por lotes | B2 | "Batch inference is more efficient." |
| edge | edge (borde, local) | B2 | "Edge deployment runs models on user devices." |
| on-device | en dispositivo | B2 | "On-device inference protects privacy." |
| model parallelism | paralelismo de modelos | C2 | "Model parallelism splits the model across GPUs." |
| pipeline parallelism | paralelismo de pipeline | C2 | "Pipeline parallelism processes layers sequentially across GPUs." |

## EVALUACIÓN Y MÉTRICAS (30)

| EN | ES | Nivel | Ejemplo |
|----|-----|-------|---------|
| benchmark | benchmark, banco de pruebas | B2 | "MMLU is a popular benchmark." |
| metric | métrica | B2 | "Accuracy alone is insufficient." |
| accuracy | exactitud | B2 | "Top-1 accuracy on ImageNet." |
| precision | precisión | B2 | "Precision measures false positives." |
| recall | recall, sensibilidad | C1 | "Recall measures false negatives." |
| F1 score | F1 score | B2 | "F1 is the harmonic mean of precision and recall." |
| perplexity | perplejidad | C1 | "Lower perplexity indicates better language modeling." |
| BLEU | BLEU | C1 | "BLEU measures translation quality." |
| ROUGE | ROUGE | C1 | "ROUGE evaluates summaries." |
| MMLU | MMLU | C1 | "MMLU tests broad world knowledge." |
| HumanEval | HumanEval | C1 | "HumanEval tests code generation." |
| GSM8K | GSM8K | C1 | "GSM8K contains grade school math problems." |
| HellaSwag | HellaSwag | C2 | "HellaSwag tests commonsense reasoning." |
| TruthfulQA | TruthfulQA | C2 | "TruthfulQA measures resistance to misconceptions." |
| ARC | ARC challenge | C2 | "ARC focuses on scientific reasoning." |
| pass@1 / pass@k | tasa de aciertos | C2 | "pass@1 is the first-attempt success rate." |
| zero-shot accuracy | exactitud zero-shot | C1 | "Zero-shot accuracy on novel tasks." |
| few-shot accuracy | exactitud few-shot | C1 | "Few-shot accuracy with 5 examples." |
| leaderboard | tabla de clasificación | B2 | "Open LLM Leaderboard ranks models." |
| eval suite | suite de evaluación | C1 | "lm-eval-harness is a standard eval suite." |
| baseline | línea base | B2 | "Our method outperforms the baseline." |
| state-of-the-art (SOTA) | estado del arte | B2 | "SOTA on this task is 89%." |
| ablation | ablación | C2 | "Ablation studies isolate component contributions." |
| reproducibility | reproducibilidad | C1 | "Reproducibility requires fixed random seeds." |
| robustness | robustez | C1 | "Robustness to adversarial inputs is critical." |
| generalization | generalización | C1 | "Out-of-distribution generalization is hard." |
| out-of-distribution (OOD) | fuera de distribución | C2 | "OOD samples fool models easily." |
| in-distribution | en distribución | C2 | "In-distribution accuracy is misleading." |
| bias | sesgo | B2 | "Bias in training data propagates to outputs." |
| fairness | imparcialidad, justicia | C1 | "Fairness metrics quantify discrimination." |

## AGENTES Y ORQUESTACIÓN (30)

| EN | ES | Nivel | Ejemplo |
|----|-----|-------|---------|
| agent | agente | B2 | "An agent uses tools to accomplish goals." |
| tool calling | invocación de herramientas | C1 | "Tool calling enables external actions." |
| function calling | function calling | C1 | "Function calling outputs structured JSON." |
| MCP | MCP (Model Context Protocol) | C2 | "MCP standardizes tool integration." |
| ReAct | ReAct (Reason + Act) | C2 | "ReAct interleaves thoughts and actions." |
| chain-of-thought | cadena de pensamiento | C1 | "Chain-of-thought improves multi-step reasoning." |
| planner | planificador | C1 | "The planner generates a sequence of actions." |
| executor | ejecutor | C1 | "The executor performs the planned actions." |
| sandbox | sandbox (entorno aislado) | B2 | "Code execution runs in a sandbox." |
| tool use | uso de herramientas | B2 | "Tool use extends model capabilities." |
| router | enrutador | B2 | "The router decides which model handles each request." |
| orchestration | orquestación | C1 | "Multi-agent orchestration is complex." |
| memory | memoria | A2 | "Long-term memory persists across sessions." |
| short-term memory | memoria de corto plazo | C1 | "Short-term memory is the active context." |
| long-term memory | memoria de largo plazo | C1 | "Long-term memory uses vector databases." |
| vector database | base de datos vectorial | C1 | "Pinecone is a popular vector database." |
| embedding model | modelo de embeddings | C1 | "OpenAI's text-embedding-3 is widely used." |
| chunk | fragmento, trozo | B2 | "Chunks should be 200-500 tokens." |
| chunking | fragmentación | C1 | "Chunking strategies affect retrieval quality." |
| retrieval | recuperación | B2 | "Hybrid retrieval combines dense and sparse." |
| BM25 | BM25 | C2 | "BM25 is the standard sparse retrieval baseline." |
| cosine similarity | similitud coseno | C1 | "Cosine similarity ranks document relevance." |
| reranking | reranqueo | C2 | "Reranking improves the top-k results." |
| late interaction | interacción tardía | C2 | "ColBERT uses late interaction." |
| hybrid search | búsqueda híbrida | C1 | "Hybrid search combines BM25 and dense vectors." |
| guardrail | barandilla, salvaguarda | C1 | "Guardrails prevent harmful outputs." |
| kill switch | interruptor de emergencia | C1 | "Always include a kill switch for autonomous agents." |
| trace | traza | C1 | "Traces help debug agent behavior." |
| observability | observabilidad | C1 | "Observability tools track agent runs." |
| autonomy | autonomía | B2 | "Higher autonomy means less human oversight." |

---

## Plan de 10 semanas

```
Semana 1-2:  Arquitectura modelos (40)
Semana 3-4:  Entrenamiento y optimización (40)
Semana 5:    Inferencia y generación (30)
Semana 6:    Cuantización y hardware (30)
Semana 7-8:  Evaluación y métricas (30)
Semana 9-10: Agentes y orquestación (30)
```

Total: 200 palabras técnicas en 10 semanas con 5/día activo.

---

## Resultado esperado

Tras dominar estas 200 palabras + AWL completa + Top 5000 frecuencia, podrás:

- Leer **Attention Is All You Need** sin diccionario.
- Leer blogs de Karpathy, Lilian Weng, Anthropic, OpenAI con fluidez.
- Entender configuraciones de Ollama, vLLM, Hugging Face sin trabar.
- Diferenciar matices técnicos finos (latency vs throughput, precision vs accuracy, fine-tuning vs RLHF vs DPO).

Esto es C2 lectura técnica de IA en su forma más útil para tu trabajo real.

---

**Cierre del bloque de semillas.** Estas 5 semillas son tu kit de arranque para los primeros 6-8 meses de AIC2-Lector. El resto del contenido se construye sobre el motor (cuando llegue su momento).
