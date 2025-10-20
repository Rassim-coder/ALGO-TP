
console.log("Vis.js loaded:", typeof vis !== 'undefined');


// Update ABR properties in the info panel
function updateABRProperties(tpNumber = 1) {
    const propsElement = document.querySelector(`.tp${tpNumber}-properties`);
    if (!propsElement) return;
    
    const height = bst && bst.root ? bst.getHeight() : 0;
    const degree = bst && bst.root ? bst.getDegree() : 0;
    
    propsElement.innerHTML = `
        <div>Type: <span class="tp${tpNumber}-prop-value">ABR</span></div>
        <div>Hauteur: <span class="tp${tpNumber}-prop-value">${height}</span></div>
        <div>Degré: <span class="tp${tpNumber}-prop-value">${degree}</span></div>
    `;
}

// Update AVL properties in the info panel
function updateAVLProperties(tpNumber = 1) {
    const propsElement = document.querySelector(`.tp${tpNumber}-properties`);
    if (!propsElement || !avl) return;
    
    const height = avl.root ? avl.getHeight() : 0;
    const degree = avl.root ? avl.getDegree() : 0;
    
    propsElement.innerHTML = `
        <div>Type: <span class="tp${tpNumber}-prop-value">AVL</span></div>
        <div>Hauteur: <span class="tp${tpNumber}-prop-value">${height}</span></div>
        <div>Degré: <span class="tp${tpNumber}-prop-value">${degree}</span></div>
    `;
}

// AVL Node class
class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// AVL Tree class
class AVL {
    constructor() {
        this.root = null;
    }
    
    // Get height of node
    height(node) {
        return node === null ? 0 : node.height;
    }
    
    // Get balance factor
    getBalance(node) {
        return node === null ? 0 : this.height(node.left) - this.height(node.right);
    }
    
    // Update height of node
    updateHeight(node) {
        if (node !== null) {
            node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
        }
    }
    
    // Right rotation
    rotateRight(z) {
        let y = z.left;
        let T2 = y.right;
        
        y.right = z;
        z.left = T2;
        
        this.updateHeight(z);
        this.updateHeight(y);
        
        return y;
    }
    
    // Left rotation
    rotateLeft(z) {
        let y = z.right;
        let T2 = y.left;
        
        y.left = z;
        z.right = T2;
        
        this.updateHeight(z);
        this.updateHeight(y);
        
        return y;
    }
    
    // Insert a value into the AVL tree
    insert(value) {
        this.root = this.insertNode(this.root, value);
    }

    // Find minimum value in a tree
    findMin(node = this.root) {
        while (node && node.left !== null) {
            node = node.left;
        }
        return node;
    }

    // Delete a node with the given value
    delete(value) {
        this.root = this.deleteNode(this.root, value);
        return this.root !== null;
    }

    deleteNode(node, value) {
        // Standard BST delete
        if (node === null) return null;

        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
        } else {
            // Node with only one child or no child
            if (node.left === null || node.right === null) {
                const temp = node.left || node.right;
                
                // No child case
                if (temp === null) {
                    node = null;
                } else { // One child case
                    node = temp; // Copy the contents of the non-empty child
                }
            } else {
                // Node with two children: Get the inorder successor (smallest
                // in the right subtree)
                const temp = this.findMin(node.right);
                node.value = temp.value;
                node.right = this.deleteNode(node.right, temp.value);
            }
        }

        // If the tree had only one node then return
        if (node === null) return null;

        // Update height of the current node
        this.updateHeight(node);

        // Get the balance factor
        const balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rotateRight(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.rotateLeft(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }
    
    insertNode(node, value) {
        // 1. Normal BST insert
        if (node === null) {
            return new AVLNode(value);
        }
        
        if (value < node.value) {
            node.left = this.insertNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.insertNode(node.right, value);
        } else {
            // Duplicate - don't insert
            return node;
        }
        
        // 2. Update height
        this.updateHeight(node);
        
        // 3. Get balance factor
        let balance = this.getBalance(node);
        
        // 4. Balance the tree if needed
        
        // Left-Left Case
        if (balance > 1 && value < node.left.value) {
            return this.rotateRight(node);
        }
        
        // Right-Right Case
        if (balance < -1 && value > node.right.value) {
            return this.rotateLeft(node);
        }
        
        // Left-Right Case
        if (balance > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        
        // Right-Left Case
        if (balance < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }
        
        return node;
    }
    
    // Search for a value in the AVL tree
    search(value, node = this.root) {
        if (node === null) return null;
        if (value === node.value) return node;
        if (value < node.value) return this.search(value, node.left);
        return this.search(value, node.right);
    }
    
    // Get tree height (for properties display)
    getHeight(node = this.root) {
        return this.height(node);
    }
    
    // Get max degree
    getDegree(node = this.root) {
        if (node === null) return 0;
        let childCount = 0;
        if (node.left !== null) childCount++;
        if (node.right !== null) childCount++;
        
        let maxDegree = childCount;
        if (node.left) maxDegree = Math.max(maxDegree, this.getDegree(node.left));
        if (node.right) maxDegree = Math.max(maxDegree, this.getDegree(node.right));
        
        return maxDegree;
    }
}

// Node class for BST
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree class
class BST {
    constructor() {
        this.root = null;
    }
    
insert(value) {
    const newNode = new Node(value);
    
    if (this.root === null) {
        this.root = newNode;
        return true;
    } else {
        return this.insertNode(this.root, newNode);
    }
}

insertNode(node, newNode) {
    // Check for duplicate
    if (newNode.value === node.value) {
        return false; // Duplicate found
    }
    
    if (newNode.value < node.value) {
        if (node.left === null) {
            node.left = newNode;
            return true;
        } else {
            return this.insertNode(node.left, newNode);
        }
    } else {
        if (node.right === null) {
            node.right = newNode;
            return true;
        } else {
            return this.insertNode(node.right, newNode);
        }
    }
}
    
    // Search for a value in the tree
    search(value, node = this.root) {
        if (node === null) return null;
        if (value === node.value) return node;
        if (value < node.value) return this.search(value, node.left);
        return this.search(value, node.right);
    }
    
    // Calculate height of the tree
    getHeight(node = this.root) {
        if (node === null) return 0;
        return 1 + Math.max(
            this.getHeight(node.left), 
            this.getHeight(node.right)
        );
    }
    
    // Find minimum value in a tree
    findMin(node = this.root) {
        while (node && node.left !== null) {
            node = node.left;
        }
        return node;
    }

    // Delete a node with the given value
    delete(value) {
        this.root = this.deleteNode(this.root, value);
        return this.root !== null;
    }

    deleteNode(node, value) {
        if (node === null) return null;

        // Find the node to delete
        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
        } else {
            // Node with only one child or no child
            if (node.left === null) {
                return node.right;
            } else if (node.right === null) {
                return node.left;
            }

            // Node with two children: Get the inorder successor (smallest
            // in the right subtree)
            const temp = this.findMin(node.right);
            node.value = temp.value;
            node.right = this.deleteNode(node.right, temp.value);
        }
        return node;
    }

    // Calculate degree of the tree (maximum number of children)
    getDegree(node = this.root) {
        if (node === null) return 0;
        let childCount = 0;
        if (node.left !== null) childCount++;
        if (node.right !== null) childCount++;
        
        let maxDegree = childCount;
        if (node.left) maxDegree = Math.max(maxDegree, this.getDegree(node.left));
        if (node.right) maxDegree = Math.max(maxDegree, this.getDegree(node.right));
        
        return maxDegree;
    }
}

// Visualize Binary Search Tree using vis.js
function visualizeTree(tree, containerId = 'treeNetwork') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        return;
    }
    
    container.innerHTML = '';
    
    let nodesArray = [];
    let edgesArray = [];
    let nodeId = 0;
    
    // Update the global bst reference if a new tree is provided
    if (tree) {
        window.bst = tree;
    }
    
    function buildGraph(node, parentId = null) {
        if (node === null) return;
        
        const currentId = nodeId++;
        
        nodesArray.push({
            id: currentId,
            label: String(node.value),
            color: {
                background: '#3b82f6',
                border: '#1e40af',
                highlight: { background: '#2563eb', border: '#1e3a8a' }
            },
            font: { color: 'white', size: 16, bold: true },
            shape: 'circle',
            size: 30
        });
        
        if (parentId !== null) {
            edgesArray.push({
                from: parentId,
                to: currentId,
                color: '#64748b',
                width: 2,
                smooth: false
            });
        }
        
        // Store the current ID to use as parent for children
        const myId = currentId;
        buildGraph(node.left, myId);
        buildGraph(node.right, myId);
    }
    
    buildGraph(bst.root);
    
    const data = {
        nodes: new vis.DataSet(nodesArray),
        edges: new vis.DataSet(edgesArray)
    };
    
    const options = {
        layout: {
            hierarchical: {
                direction: 'UD',
                sortMethod: 'directed',
                levelSeparation: 100,
                nodeSpacing: 150
            }
        },
        physics: false,
        edges: { smooth: false },
        interaction: {
            dragNodes: false,
            dragView: true,
            zoomView: true
        }
    };
    
    new vis.Network(container, data, options);
    
    // Update properties after rendering
    if (bst && bst.root) {
        updateABRProperties();
    }
}

// Visualize AVL Tree using vis.js
function visualizeAVL(avlTree, containerId = 'treeNetwork') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        return;
    }
    
    container.innerHTML = '';
    
    let nodesArray = [];
    let edgesArray = [];
    let nodeId = 0;
    
    function buildGraph(node, parentId = null) {
        if (node === null) return;
        
        const currentId = nodeId++;
        
        nodesArray.push({
            id: currentId,
            label: `${node.value} (h:${node.height})`,
            color: {
                background: '#10b981',  // Different color for AVL
                border: '#047857',
                highlight: { background: '#34d399', border: '#065f46' }
            },
            font: { 
                color: 'white', 
                size: 14, 
                bold: true,
                multi: 'html'
            },
            shape: 'circle',
            size: 30
        });
        
        if (parentId !== null) {
            edgesArray.push({
                from: parentId,
                to: currentId,
                color: '#64748b',
                width: 2,
                smooth: false
            });
        }
        
        // Store the current ID to use as parent for children
        const myId = currentId;
        buildGraph(node.left, myId);
        buildGraph(node.right, myId);
    }
    
    buildGraph(avlTree.root);
    
    const data = {
        nodes: new vis.DataSet(nodesArray),
        edges: new vis.DataSet(edgesArray)
    };
    
    const options = {
        layout: {
            hierarchical: {
                direction: 'UD',
                sortMethod: 'directed',
                levelSeparation: 100,
                nodeSpacing: 150
            }
        },
        physics: false,
        edges: { smooth: false },
        interaction: {
            dragNodes: false,
            dragView: true,
            zoomView: true
        }
    };
    
    new vis.Network(container, data, options);
}


let bst = new BST();
let avl = new AVL();

// TP2: Search in BST
function searchInBST(value) {
    if (!bst || !bst.root) return false;
    const foundNode = bst.search(value);
    
    // Highlight the found node
    if (foundNode) {
        const nodes = [];
        const edges = [];
        let nodeId = 1;
        
        // Create a queue for BFS traversal
        const queue = [{node: bst.root, parent: null, isLeft: false}];
        
        while (queue.length > 0) {
            const {node, parent, isLeft} = queue.shift();
            if (!node) continue;
            
            // Add node to visualization
            nodes.push({
                id: nodeId,
                label: node.value.toString(),
                color: node === foundNode ? '#90EE90' : '#97C2FC',
                font: {color: node === foundNode ? '#000' : '#fff'}
            });
            
            // Add edge to parent
            if (parent) {
                edges.push({
                    from: parent,
                    to: nodeId,
                    arrows: 'to',
                    smooth: {type: 'curvedCW', roundness: 0.2}
                });
            }
            
            // Add children to queue
            if (node.left) queue.push({node: node.left, parent: nodeId, isLeft: true});
            if (node.right) queue.push({node: node.right, parent: nodeId, isLeft: false});
            
            nodeId++;
        }
        
        // Update visualization
        const container = document.getElementById('tp2-treeNetwork');
        const data = {nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges)};
        const options = {
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed'
                }
            },
            physics: false
        };
        
        new vis.Network(container, data, options);
    }
    
    return foundNode !== null;
}

// TP2: Delete from BST
function deleteFromBST(value) {
    if (!bst || !bst.root) return false;
    
    // Delete the node
    const success = bst.delete(value);
    
    // Update visualization
    if (success) {
        visualizeTree(bst, 'tp2-treeNetwork');
    }
    
    return success;
}

// TP2: Search in AVL
function searchInAVL(value) {
    if (!avl || !avl.root) return false;
    
    // Search for the node
    let found = false;
    const nodes = [];
    const edges = [];
    let nodeId = 1;
    
    // Create a queue for BFS traversal
    const queue = [{node: avl.root, parent: null, isLeft: false}];
    
    while (queue.length > 0) {
        const {node, parent, isLeft} = queue.shift();
        if (!node) continue;
        
        // Check if this is the node we're looking for
        const isTarget = node.value === value;
        if (isTarget) found = true;
        
        // Add node to visualization
        nodes.push({
            id: nodeId,
            label: node.value.toString(),
            color: isTarget ? '#90EE90' : '#FF9F1C',
            font: {color: isTarget ? '#000' : '#fff'}
        });
        
        // Add edge to parent
        if (parent) {
            edges.push({
                from: parent,
                to: nodeId,
                arrows: 'to',
                smooth: {type: 'curvedCW', roundness: 0.2}
            });
        }
        
        // Add children to queue
        if (node.left) queue.push({node: node.left, parent: nodeId, isLeft: true});
        if (node.right) queue.push({node: node.right, parent: nodeId, isLeft: false});
        
        nodeId++;
    }
    
    // Update visualization
    const container = document.getElementById('tp2-treeNetwork');
    const data = {nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges)};
    const options = {
        layout: {
            hierarchical: {
                direction: 'UD',
                sortMethod: 'directed'
            }
        },
        physics: false
    };
    
    new vis.Network(container, data, options);
    
    return found;
}

// TP2: Delete from AVL
function deleteFromAVL(value) {
    if (!avl || !avl.root) return false;
    
    // Delete the node
    const success = avl.delete(value);
    
    // Update visualization
    if (success) {
        visualizeAVL(avl, 'tp2-treeNetwork');
    }
    
    return success;
    avl = tempTree;
    return true;
}

// TP2: Update TP2 properties display
function updateTP2Properties() {
    const type = document.getElementById('tp2-structure').value;
    const height = type === 'ABR' ? 
        (bst && bst.root ? bst.getHeight() : 0) :
        (avl && avl.root ? avl.getHeight() : 0);
    
    const degree = type === 'ABR' ?
        (bst && bst.root ? bst.getDegree() : 0) :
        (avl && avl.root ? avl.getDegree() : 0);
    
    document.getElementById('tp2-type').textContent = type;
    document.getElementById('tp2-hauteur').textContent = height;
    document.getElementById('tp2-degree').textContent = degree;
}

// TP2: Show status message
function showStatus(message, type = 'info') {
    const status = document.getElementById('tp2-status');
    status.textContent = message;
    status.className = '';
    status.classList.add(type);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        status.className = '';
        status.textContent = '';
    }, 3000);
}

// TP2: Handle search button click
function handleSearch() {
    const searchInput = document.getElementById('tp2-search-input');
    const value = parseInt(searchInput.value);
    
    if (isNaN(value)) {
        showStatus('Veuillez entrer une valeur valide', 'error');
        return;
    }
    
    const type = document.getElementById('tp2-structure').value;
    let found = false;
    
    if (type === 'ABR') {
        found = searchInBST(value);
    } else {
        found = searchInAVL(value);
    }
    
    if (found) {
        showStatus(`La valeur ${value} a été trouvée dans l'arbre.`, 'success');
        // Highlight the found node (you can implement this)
    } else {
        showStatus(`La valeur ${value} n'a pas été trouvée dans l'arbre.`, 'error');
    }
    
    searchInput.value = '';
}

// TP2: Handle delete button click
function handleDelete() {
    const deleteInput = document.getElementById('tp2-delete-input');
    const value = parseInt(deleteInput.value);
    
    if (isNaN(value)) {
        showStatus('Veuillez entrer une valeur valide', 'error');
        return;
    }
    
    const type = document.getElementById('tp2-structure').value;
    let success = false;
    
    if (type === 'ABR') {
        success = deleteFromBST(value);
        if (success) {
            visualizeTree(bst);
        }
    } else {
        success = deleteFromAVL(value);
        if (success) {
            visualizeAVL(avl);
        }
    }
    
    if (success) {
        showStatus(`La valeur ${value} a été supprimée avec succès.`, 'success');
        updateTP2Properties();
    } else {
        showStatus(`La valeur ${value} n'a pas été trouvée.`, 'error');
    }
    
    deleteInput.value = '';
}
document.addEventListener('DOMContentLoaded', function() {
    // TP2 Elements
    const tp2Structure = document.getElementById('tp2-structure');
    const tp2ActionBtn = document.getElementById('tp2-action-btn');
    const tp2ResetBtn = document.getElementById('tp2-reset-btn');
    const tp2ValuesInput = document.getElementById('tp2-values');
    const tp2SearchBtn = document.getElementById('tp2-search-btn');
    const tp2DeleteBtn = document.getElementById('tp2-delete-btn');
    const tp2SearchSection = document.getElementById('tp2-search-section');
    const tp2DeleteSection = document.getElementById('tp2-delete-section');
    
    // TP2: Show search/delete sections after tree is built
    function showTP2Sections() {
        tp2SearchSection.style.display = 'block';
        tp2DeleteSection.style.display = 'block';
    }
    
    // TP2: Reset TP2 visualization
    function resetTP2Visualization() {
        if (tp2Structure.value === 'ABR') {
            bst = new BST();
        } else {
            avl = new AVL();
        }
        
        const container = document.getElementById('tp2-treeNetwork');
        container.innerHTML = '';
        
        tp2SearchSection.style.display = 'none';
        tp2DeleteSection.style.display = 'none';
        document.getElementById('tp2-status').textContent = '';
        updateTP2Properties();
    }
    
    // TP2: Handle build button click
    function handleTP2Build() {
        const values = tp2ValuesInput.value
            .split(',')
            .map(v => parseInt(v.trim()))
            .filter(v => !isNaN(v));
            
        if (values.length === 0) {
            showStatus('Veuillez entrer des valeurs valides', 'error');
            return;
        }
        
        const type = tp2Structure.value;
        
        if (type === 'ABR') {
            bst = new BST();
            values.forEach(v => bst.insert(v));
            visualizeTree(bst, 'tp2-treeNetwork');
        } else {
            avl = new AVL();
            values.forEach(v => avl.insert(v));
            visualizeAVL(avl, 'tp2-treeNetwork');
        }
        
        showTP2Sections();
        updateTP2Properties();
        showStatus('Arbre construit avec succès!', 'success');
    }
    
    // TP2: Initialize event listeners
    if (tp2ActionBtn) {
        tp2ActionBtn.addEventListener('click', handleTP2Build);
    }
    
    if (tp2ResetBtn) {
        tp2ResetBtn.addEventListener('click', resetTP2Visualization);
    }
    
    if (tp2SearchBtn) {
        tp2SearchBtn.addEventListener('click', handleSearch);
    }
    
    if (tp2DeleteBtn) {
        tp2DeleteBtn.addEventListener('click', handleDelete);
    }
    // Navigation and menu handling
    const menuItems = document.querySelectorAll('.menu-item');
    const tpContents = [
        document.getElementById('tp1-content'),
        document.getElementById('tp2-content'),
        document.getElementById('tp3-content'),
        document.getElementById('tp4-content'),
        document.getElementById('tp5-content')
    ];
    const landing = document.getElementById('landing-content');
    const landingBtn = document.getElementById('landing-btn');
    let currentIdx = null;

    // TP1 Elements
    const tp1Structure = document.getElementById('tp1-structure');
    const tp1Canvas = document.querySelector('.tp1-canvas');
    const tp1Reset = document.querySelector('.tp1-reset');
    const tp1Input = document.getElementById('tp1-node');
    const actionBtn = document.getElementById('action-btn');
    const tp1Props = document.querySelector('.tp1-properties');
    const treeOptions = document.getElementById('tree-options');
    const graphOptions = document.getElementById('graph-options');
    const nodeCountInput = document.getElementById('node-count');
    const abrValuesInput = document.getElementById('abr-values');
    


    // Initialize UI state
    function initUI() {
        // Hide all TP sections and show only landing at start
        menuItems.forEach(item => item.classList.remove('active'));
        tpContents.forEach(tp => tp.classList.remove('visible', 'fade-in', 'fade-out'));
        landing.classList.add('visible');
        
        // Set up structure change handler
        if (tp1Structure) {
            handleStructureChange();
            tp1Structure.addEventListener('change', handleStructureChange);
        }

        // Set up action button
        if (actionBtn) {
            actionBtn.addEventListener('click', handleAction);
        }

        // Set up reset button
        if (tp1Reset) {
            tp1Reset.addEventListener('click', (e) => {
                e.preventDefault();
                resetVisualization(1);
            });
        }
    }

    // Handle structure type change
    function handleStructureChange() {
        const selectedValue = tp1Structure.value;
        const isGraph = selectedValue === 'Graphe';
        const isABR = selectedValue === 'ABR';
        const isAVL = selectedValue === 'AVL';
        
        // Toggle between tree and graph options
        treeOptions.style.display = isGraph ? 'none' : 'block';
        graphOptions.style.display = isGraph ? 'block' : 'none';
        
        // Toggle between different tree options
        const abrOptions = document.getElementById('abr-options');
        const avlOptions = document.getElementById('avl-options');
        const otherTreeOptions = document.getElementById('other-tree-options');
        
        abrOptions.style.display = isABR ? 'block' : 'none';
        avlOptions.style.display = isAVL ? 'block' : 'none';
        otherTreeOptions.style.display = (!isABR && !isAVL && !isGraph) ? 'block' : 'none';
        
        // Update button text
        if (actionBtn) {
            if (isGraph) {
                actionBtn.textContent = 'Générer Graphe';
            } else if (isABR) {
                actionBtn.textContent = 'Construire ABR';
            } else if (isAVL) {
                actionBtn.textContent = 'Construire AVL';
            } else {
                actionBtn.textContent = 'Ajouter Noeud';
            }
        }
        
        updateCanvasAndProps(selectedValue);
    }

    // Handle action button click (Add Node, Build ABR, Build AVL, or Generate Graph)
    function handleAction() {
        const selectedValue = tp1Structure.value;
        
        if (selectedValue === 'Graphe') {
            // Handle graph generation
            const nodeCount = nodeCountInput ? parseInt(nodeCountInput.value) : 5;
            const graphType = document.querySelector('input[name="graph-type"]:checked').value;
            const weightType = document.querySelector('input[name="graph-weight"]:checked').value;
            
            // Validate node count
            if (nodeCount < 2 || nodeCount > 15) {
                alert('Le nombre de nœuds doit être entre 2 et 15');
                return;
            }
            
            // Generate graph visualization
            generateGraph(nodeCount, graphType, weightType);
        } else if (selectedValue === 'ABR' || selectedValue === 'AVL') {
            // Get the appropriate input element based on tree type
            const inputElement = selectedValue === 'ABR' ? 
                document.getElementById('abr-values') : 
                document.getElementById('avl-values');
                
            const values = inputElement.value
                .split(',')
                .map(val => val.trim())
                .filter(val => val !== '')
                .map(Number);
                
            // Validate input
            if (values.length === 0 || values.some(isNaN)) {
                alert('Veuillez entrer des valeurs numériques valides séparées par des virgules');
                return;
            }
            
            if (selectedValue === 'ABR') {
                // Handle ABR construction
                bst = new BST();
                const duplicates = [];
                
                values.forEach(value => {
                    if (!bst.insert(value)) {
                        duplicates.push(value);
                    }
                });
                
                console.log('ABR construit:', bst);
                
                // Show message if duplicates were found
                if (duplicates.length > 0) {
                    alert(`Valeurs dupliquées ignorées: ${duplicates.join(', ')}`);
                }
                
                // Visualize the BST
                visualizeTree(bst);
                updateABRProperties();
            } else { // AVL
                // Handle AVL construction
                avl = new AVL();
                
                values.forEach(value => {
                    avl.insert(value);
                });
                
                console.log('AVL construit:', avl);
                
                // Visualize the AVL tree
                visualizeAVL(avl);
                updateAVLProperties();
            }
        } else {
            // Handle other tree node addition
            const nodeValue = tp1Input ? tp1Input.value.trim() : '';
            
            if (!nodeValue) {
                alert('Veuillez entrer une valeur pour le nœud');
                return;
            }
            
            // Add node to the tree visualization
            addTreeNode(nodeValue, selectedValue);
        }
    }

    // Generate graph visualization
    function generateGraph(nodeCount, graphType, weightType) {
        if (!tp1Canvas) return;
        
        // Clear previous content
        tp1Canvas.innerHTML = '';
        
        // Create a container for the graph
        const graphContainer = document.createElement('div');
        graphContainer.style.width = '100%';
        graphContainer.style.height = '100%';
        graphContainer.style.display = 'flex';
        graphContainer.style.justifyContent = 'center';
        graphContainer.style.alignItems = 'center';
        graphContainer.style.flexDirection = 'column';
        
        // Add graph info
        const graphInfo = document.createElement('div');
        graphInfo.textContent = `Graphe ${graphType} ${weightType} avec ${nodeCount} nœuds`;
        graphInfo.style.marginBottom = '20px';
        graphInfo.style.fontWeight = 'bold';
        graphContainer.appendChild(graphInfo);
        
        // Add a simple visualization
        const graphViz = document.createElement('div');
        graphViz.style.width = '80%';
        graphViz.style.height = '80%';
        graphViz.style.border = '2px dashed #b7c5e9';
        graphViz.style.borderRadius = '8px';
        graphViz.style.display = 'flex';
        graphViz.style.justifyContent = 'center';
        graphViz.style.alignItems = 'center';
        graphViz.style.color = '#b7c5e9';
        graphViz.textContent = `Visualisation du graphe (${graphType}, ${weightType})`;
        
        graphContainer.appendChild(graphViz);
        tp1Canvas.appendChild(graphContainer);
        
        // Update properties
        updateGraphProperties(nodeCount, graphType, weightType);
    }

    // Add node to tree visualization
    function addTreeNode(value, treeType, tpNumber = 1) {
        const canvasId = tpNumber === 1 ? 'treeNetwork' : 'tp2-treeNetwork';
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // For now, just show a simple message
        // In a real implementation, this would update the tree visualization
        canvas.textContent = `Ajout du nœud ${value} à l'arbre de type ${treeType}`;
        
        // Update properties
        updateTreeProperties(treeType, tpNumber);
    }

    // Update graph properties in the info panel
    function updateGraphProperties(nodeCount, graphType, weightType, tpNumber = 1) {
        const propsElement = document.querySelector(`.tp${tpNumber}-properties`);
        if (!propsElement) return;
        
        // Simulate some properties
        const density = (Math.random() * 0.8 + 0.1).toFixed(2);
        const avgDegree = (nodeCount * 0.7).toFixed(1);
        
        propsElement.innerHTML = `
            <div>Nombre de nœuds: <span class="tp${tpNumber}-prop-value">${nodeCount}</span></div>
            <div>Type: <span class="tp${tpNumber}-prop-value">${graphType}</span></div>
            <div>Poids: <span class="tp${tpNumber}-prop-value">${weightType}</span></div>
            <div>Degré moyen: <span class="tp${tpNumber}-prop-value">${avgDegree}</span></div>
            <div>Densité: <span class="tp${tpNumber}-prop-value">${density}</span></div>
        `;
    }

    // Update tree properties in the info panel
    function updateTreeProperties(treeType, tpNumber = 1) {
        const propsElement = document.querySelector(`.tp${tpNumber}-properties`);
        if (!propsElement) return;
        
        // Don't update for ABR/AVL, use updateABRProperties/updateAVLProperties instead
        if (treeType === 'ABR') {
            updateABRProperties(tpNumber);
            return;
        }
        if (treeType === 'AVL') {
            updateAVLProperties(tpNumber);
            return;
        }
        
        // Simulate some properties for other tree types
        const height = Math.floor(Math.random() * 5 + 2);
        const nodeCount = Math.floor(Math.random() * 10 + 1);
        
        propsElement.innerHTML = `
            <div>Type: <span class="tp${tpNumber}-prop-value">${treeType}</span></div>
            <div>Hauteur: <span class="tp${tpNumber}-prop-value">${height}</span></div>
            <div>Nombre de nœuds: <span class="tp${tpNumber}-prop-value">${nodeCount}</span></div>
        `;
    }

    // Reset visualization
    function resetVisualization(tpNumber = 1) {
        const canvasId = tpNumber === 1 ? 'treeNetwork' : 'tp2-treeNetwork';
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            canvas.textContent = 'Prêt à construire';
            canvas.style.padding = '0';
        }
        
        const input = document.getElementById(tpNumber === 1 ? 'tp1-node' : 'tp2-node');
        if (input) input.value = '';
        
        // Reset properties panel
        const propsElement = document.querySelector(`.tp${tpNumber}-properties`);
        if (propsElement) {
            propsElement.innerHTML = `
                <div>Type: <span class="tp${tpNumber}-prop-value">-</span></div>
                <div>Hauteur: <span class="tp${tpNumber}-prop-value">-</span></div>
                <div>Degré: <span class="tp${tpNumber}-prop-value">-</span></div>
                <div>Densité: <span class="tp${tpNumber}-prop-value">-</span></div>
            `;
        }
    }

    // Update canvas and properties based on selected structure
    function updateCanvasAndProps(type, tpNumber = 1) {
        const canvasId = tpNumber === 1 ? 'treeNetwork' : 'tp2-treeNetwork';
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Clear previous content
        canvas.textContent = type ? `Structure sélectionnée: ${type}` : 'Prêt à construire';
        canvas.style.padding = '20px';
        
        // Reset properties panel
        resetVisualization(tpNumber);
    }

    // Initialize the UI
    initUI();

    // Menu item click handler
    menuItems.forEach((item, idx) => {
        item.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
            ripple.style.left = (e.clientX - rect.left - rect.width/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - rect.height/2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);

            // Active switching
            document.querySelector('.menu-item.active')?.classList.remove('active');
            this.classList.add('active');

            // Always hide all TP sections before showing the new one
            tpContents.forEach(tp => tp.classList.remove('visible', 'fade-in', 'fade-out'));

            // If landing page is visible, fade it out and show the selected TP
            if (currentIdx === null) {
                landing.classList.remove('visible');
                landing.classList.add('fade-out');
                setTimeout(() => {
                    landing.classList.remove('fade-out');
                    tpContents[idx].classList.add('visible', 'fade-in');
                    setTimeout(() => {
                        tpContents[idx].classList.remove('fade-in');
                    }, 300);
                }, 300);
                currentIdx = idx;
            } else if (idx !== currentIdx) {
                // Fade out current TP, fade in new TP
                const prev = tpContents[currentIdx];
                prev.classList.remove('visible');
                prev.classList.add('fade-out');
                setTimeout(() => {
                    prev.classList.remove('fade-out');
                    tpContents[idx].classList.add('visible', 'fade-in');
                    setTimeout(() => {
                        tpContents[idx].classList.remove('fade-in');
                    }, 300);
                }, 300);
                currentIdx = idx;
            }
        });
    });

    // Landing button click handler
    if (landingBtn) {
        landingBtn.addEventListener('click', function() {
            // Remove active from all menu items
            document.querySelectorAll('.menu-item.active').forEach(btn => btn.classList.remove('active'));
            // Fade out current TP if any
            if (currentIdx !== null) {
                const prev = tpContents[currentIdx];
                prev.classList.remove('visible');
                prev.classList.add('fade-out');
                setTimeout(() => {
                    prev.classList.remove('fade-out');
                    landing.classList.add('visible', 'fade-in');
                    setTimeout(() => {
                        landing.classList.remove('fade-in');
                    }, 300);
                }, 300);
                currentIdx = null;
            }
        });
    }
});