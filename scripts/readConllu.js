var ConlluParser = class ConlluParser {
  static defaultColumnNames = () => {
    return ["id", "form", "lemma", "upostag", "xpostag", "feats", "head", "deprel", "deps", "misc"];
  }
  // https://universaldependencies.org/ext-format.html
  // https://universaldependencies.org/format.html
  // https://universaldependencies.org/conllu_viewer.html
  // https://github.com/spyysalo/conllu.js/blob/master/conllu.js
  // http://brat.nlplab.org/embed.html#live
  // http://brat.nlplab.org/features.html
  // https://universaldependencies.org/u/overview/morphology.html#layered-features
  // https://universaldependencies.org/u/overview/feat-layers.html
  constructor(wrap) {
    this.settings = {
      word_glyph: wrap?.word_glyph ?? "w",
      place_holder: wrap?.place_holder ?? "_",
      plain_comment_key: wrap?.plain_comment_key ?? "comment",

      root_mark: wrap?.root_mark ?? "<root>",
      tree_spliter: wrap?.tree_spliter ?? [' ', 'space'],

      use_global_columns_desc: wrap?.use_global_columns_desc ?? false,
      global_comment_mark: wrap?.global_comment_mark ?? "global",
      global_columns_desc_key: wrap?.global_columns_desc_key ?? "columns",
      columns: wrap?.columns ?? ConlluParser.defaultColumnNames(),
    };
  }

  parse(text) {
    return this.textToTrees(text);
  }

  textToTrees(text) {
    const lines = text.split(/\r?\n/);
    return this.linesToTrees(lines);
  }

  linesToTrees(lines) {
    const STS = this.settings;
    const trees = [];
    const global_comments = [];

    if (lines[(lines?.length??0)-1]!=''){
      lines.push('');  // 末了的分割行
    };

    let columns = STS.columns ?? ConlluParser.defaultColumnNames();
    // console.log(columns);

    let tree_desc = [];
    let tree_nodes = [];
    let tree_comments = [];
    for (let line of lines) {
      // 注释行
      if (line.match(/^(#)/)) {
        const text = line.replace(/^(#)\s*/g, "");
        const parts = text.split(/\s*=\s*/g);
        const kv = !parts[1]?.length ? [STS.plain_comment_key, parts[0]] : [parts[0], parts.slice(1).join("")];
        const k_path = kv[0].split(".");
        if (k_path[0]==STS.global_comment_mark) {
          global_comments.push(kv);
          // 如果是设置列名的
          if (k_path.slice(1).join("")==STS.global_columns_desc_key) {
            columns = kv[1].split(/\s+/).map(it=>it.toLowerCase());
            // console.log(columns);
          };
        } else {
          tree_comments.push(kv);
        };
        continue;
      };

      // 混合行
      if (line.match(/^(\d+-)/)) {
        continue;
      };

      // 内容行
      if (line?.length) {
        let parts = line.split('\t');
        // let parts = line.split(/\t|\s{2,}/);
        // 将占位符换成空内容
        for (let ii in parts) {
          if (parts[ii] == STS.place_holder) {
            parts[ii] = "";
          };
        };

        // 构造成对象
        const line_data = {};
        for (let ii=0; ii<columns?.length; ii++) {
          // console.log([columns[ii], parts[ii]]);
          line_data[columns[ii]] = parts[ii] ?? "";
        };
        // console.log(line_data);

        if (tree_desc.length) {
          // 分隔
          tree_desc.push(STS.tree_spliter);
        };
        tree_desc.push([line_data?.form??"", `${STS.word_glyph}${line_data?.id??""}`]);

        if (!tree_nodes.length) {
          // 根节点
          tree_nodes.push({
            id: `${STS.word_glyph}0`,
            ord: 0,
            parent: null,
            data: {
              id: "0",
              form: STS.root_mark,
            },
            labels: [STS.root_mark, '', ''],
          });
        };

        tree_nodes.push({
          id: `${STS.word_glyph}${line_data?.id??""}`,
          ord: tree_nodes.length,
          parent: line_data?.head??""!=="" ? `${STS.word_glyph}${line_data?.head??""}` : null,
          data: line_data,
          labels: [
            line_data?.form??"",
            `${'#{#00008b}'}${line_data?.deprel??""}`,
            `${'#{#004048}'}${line_data?.upostag??""}`,
          ],
        });
      } else if (tree_nodes.length) {
        // 一条数据读取结束 该放到结果清单里了

        // console.log(tree_nodes);

        // 我也不知道这段是干嘛的
        let last_child = [];
        for (let ii=1; ii<tree_nodes.length; ii++) {
          let head = tree_nodes[ii].data.head!=="" ? parseInt(tree_nodes[ii].data.head) : "";
          if (head!=="") {
            if (!last_child[head]) {
              tree_nodes[head].firstson = `${STS.word_glyph}${ii}`;
            } else {
              tree_nodes[last_child[head]].rbrother = `${STS.word_glyph}${ii}`;
            };
            last_child[head] = ii;
          };
        };

        trees.push({
          desc: tree_desc,
          comments: tree_comments,
          zones: {
            conllu: {
              trees: {
                "a": {
                  layer: "a",
                  nodes: tree_nodes,
                },},},},
        });
        tree_desc = [];
        tree_nodes = [];
        tree_comments = [];
      };
    };
    return trees;
  }
}



parser = new ConlluParser;
lines = fs()[0];
trees = parser.linesToTrees(lines);
log(trees);

txt = `# global.columns = ID FORM LEMMA UPOS XPOS FEATS HEAD DEPREL DEPS MISC
# newdoc id = mf920901-001
# newpar id = mf920901-001-p1
# sent_id = mf920901-001-p1s1A
# text = Slovenská ústava: pro i proti
# text_en = Slovak constitution: pros and cons
1	Slovenská	slovenský	ADJ	AAFS1----1A----	Case=Nom|Degree=Pos|Gender=Fem|Number=Sing|Polarity=Pos	2	amod	_	_
2	ústava	ústava	NOUN	NNFS1-----A----	Case=Nom|Gender=Fem|Number=Sing|Polarity=Pos	0	root	_	SpaceAfter=No
3	:	:	PUNCT	Z:-------------	_	2	punct	_	_
4	pro	pro	ADP	RR--4----------	Case=Acc	2	appos	_	LId=pro-1
5	i	i	CCONJ	J^-------------	_	6	cc	_	LId=i-1
6	proti	proti	ADP	RR--3----------	Case=Dat	4	conj	_	LId=proti-1`


trees = parser.textToTrees(txt);
log(trees);



