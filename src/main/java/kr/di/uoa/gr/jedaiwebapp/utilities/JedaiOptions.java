package kr.di.uoa.gr.jedaiwebapp.utilities;

public class JedaiOptions {
	
	
	
	
	public static final String SCHEMA_CLUSTERING = "Schema Clustering";
    public static final String BLOCK_BUILDING = "Block Building";
    public static final String BLOCK_CLEANING = "Block Cleaning";
    public static final String COMPARISON_CLEANING = "Comparison Cleaning";
    public static final String ENTITY_MATHCING = "Entity Matching";
    public static final String ENTITY_CLUSTERING = "Entity Clustering";
    
    
    // Method configuration types
    public static final String DEFAULT_CONFIG = "Default";
    public static final String AUTOMATIC_CONFIG = "Automatic";
    public static final String MANUAL_CONFIG = "Manual";

    // Entity resolution types
    public static final String DIRTY_ER = "Dirty Entity Resolution";
    public static final String CLEAN_CLEAN_ER = "Clean-Clean Entity Resolution";

    // File type options
    public static final String CSV = "CSV";
    public static final String DATABASE = "Database";
    public static final String RDF = "RDF";
    public static final String SERIALIZED = "Serialized";
    public static final String XML = "XML";

    // Schema Clustering Methods
    public static final String NO_SCHEMA_CLUSTERING = "No Schema Clustering";
    public static final String ATTRIBUTE_NAME_CLUSTERING = "Attribute Name Clustering";
    public static final String ATTRIBUTE_VALUE_CLUSTERING = "Attribute Value Clustering";
    public static final String HOLISTIC_ATTRIBUTE_CLUSTERING = "Holistic Attribute Clustering";

    // Block Building methods
    public static final String STANDARD_TOKEN_BUILDING = "Standard/Token Blocking";
    public static final String SORTED_NEIGHBORHOOD = "Sorted Neighborhood";
    public static final String SORTED_NEIGHBORHOOD_EXTENDED = "Extended Sorted Neighborhood";
    public static final String Q_GRAMS_BLOCKING = "Q-Grams Blocking";
    public static final String Q_GRAMS_BLOCKING_EXTENDED = "Extended Q-Grams Blocking";
    public static final String SUFFIX_ARRAYS_BLOCKING = "Suffix Arrays Blocking";
    public static final String SUFFIX_ARRAYS_BLOCKING_EXTENDED = "Extended Suffix Arrays Blocking";
    public static final String LSH_SUPERBIT_BLOCKING = "LSH SuperBit Blocking";
    public static final String LSH_MINHASH_BLOCKING = "LSH MinHash Blocking";

    // Block Cleaning methods
    public static final String BLOCK_FILTERING = "Block Filtering";
    public static final String SIZE_BASED_BLOCK_PURGING = "Size-based Block Purging";
    public static final String COMPARISON_BASED_BLOCK_PURGING = "Comparison-based Block Purging";

    // Comparison Cleaning methods
    public static final String NO_CLEANING = "No cleaning";
    public static final String COMPARISON_PROPAGATION = "Comparison Propagation";
    public static final String CARDINALITY_EDGE_PRUNING = "Cardinality Edge Pruning (CEP)";
    public static final String CARDINALITY_NODE_PRUNING = "Cardinality Node Pruning (CNP)";
    public static final String WEIGHED_EDGE_PRUNING = "Weighed Edge Pruning (WEP)";
    public static final String WEIGHED_NODE_PRUNING = "Weighed Node Pruning (WNP)";
    public static final String RECIPROCAL_CARDINALITY_NODE_PRUNING = "Reciprocal Cardinality Node Pruning (ReCNP)";
    public static final String RECIPROCAL_WEIGHED_NODE_PRUNING = "Reciprocal Weighed Node Pruning (ReWNP)";
    public static final String CANOPY_CLUSTERING = "Canopy Clustering";
    public static final String CANOPY_CLUSTERING_EXTENDED = "Extended Canopy Clustering";

    // Entity Matching methods
    public static final String GROUP_LINKAGE = "Group Linkage";
    public static final String PROFILE_MATCHER = "Profile Matcher";

    // todo: These could be used for displaying names better in manual configuration (enum type)?
//    // Representation Model parameters
//    public static final String CHARACTER_BIGRAMS = "Character Bigrams";
//    public static final String CHARACTER_BIGRAM_GRAPHS = "Character Bigram Graphs";
//    public static final String CHARACTER_TRIGRAMS = "Character Trigrams";
//    public static final String CHARACTER_TRIGRAM_GRAPHS = "Character Trigram Graphs";
//    public static final String CHARACTER_FOURGRAMS = "Character Fourgrams";
//    public static final String CHARACTER_FOURGRAM_GRAPHS = "Character Fourgram Graphs";
//    public static final String TOKEN_UNIGRAMS = "Token Unigrams";
//    public static final String TOKEN_UNIGRAMS_TF_IDF = "Token Unigrams TF-IDF";
//    public static final String TOKEN_UNIGRAM_GRAPHS = "Token Unigram Graphs";
//    public static final String TOKEN_BIGRAMS = "Token Bigrams";
//    public static final String TOKEN_BIGRAMS_TF_IDF = "Token Bigrams TF-IDF";
//    public static final String TOKEN_BIGRAM_GRAPHS = "Token Bigram Graphs";
//    public static final String TOKEN_TRIGRAMS = "Token Trigrams";
//    public static final String TOKEN_TRIGRAMS_TF_IDF = "Token Trigrams TF-IDF";
//    public static final String TOKEN_TRIGRAM_GRAPHS = "Token Trigram Graphs";
//
//    // Similarity Method options
//    public static final String ARCS_SIMILARITY = "Arcs Similarity";
//    public static final String COSINE_SIMILARITY = "Cosine Similarity";
//    public static final String ENHANCED_JACCARD_SIMILARITY = "Enhanced Jaccard Similarity";
//    public static final String GENERALIZED_JACCARD_SIMILARITY = "Generalized Jaccard Similarity";
//    public static final String GRAPH_CONTAINMENT_SIMILARITY = "Graph Containment Similarity";
//    public static final String GRAPH_NORMALIZED_VALUE_SIMILARITY = "Graph Normalized Value Similarity";
//    public static final String GRAPH_VALUE_SIMILARITY = "Graph Value Similarity";
//    public static final String GRAPH_OVERALL_SIMILARITY = "Graph Overall Similarity";
//    public static final String JACCARD_SIMILARITY = "Jaccard Similarity";
//    public static final String SIGMA_SIMILARITY = "Sigma Similarity";
//    public static final String WEIGHTED_JACCARD_SIMILARITY = "Weighted Jaccard Similarity";

    // Entity Clustering methods
    public static final String CENTER_CLUSTERING = "Center Clustering";
    public static final String CONNECTED_COMPONENTS_CLUSTERING = "Connected Components Clustering";
    public static final String CUT_CLUSTERING = "Cut Clustering";
    public static final String MARKOV_CLUSTERING = "Markov Clustering";
    public static final String MERGE_CENTER_CLUSTERING = "Merge-Center Clustering";
    public static final String RICOCHET_SR_CLUSTERING = "Ricochet SR Clustering";
    public static final String UNIQUE_MAPPING_CLUSTERING = "Unique Mapping Clustering";

    // Automatic Configuration
    public static final String AUTOCONFIG_HOLISTIC = "Holistic";
    public static final String AUTOCONFIG_STEPBYSTEP = "Step-by-step";
    public static final String AUTOCONFIG_RANDOMSEARCH = "Random Search";
    public static final String AUTOCONFIG_GRIDSEARCH = "Grid Search";
}
