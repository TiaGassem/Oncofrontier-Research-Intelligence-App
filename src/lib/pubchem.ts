import type { CompoundInfo } from '@/types';

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

interface PubChemPropertyResponse {
  PropertyTable: {
    Properties: Record<string, string | number>[];
  };
}

export async function lookupCompoundByName(name: string): Promise<CompoundInfo | null> {
  try {
    const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/property/CanonicalSMILES,MolecularFormula,MolecularWeight,IUPACName/JSON`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data: PubChemPropertyResponse = await resp.json();
    const props = data.PropertyTable?.Properties?.[0];
    if (!props) return null;

    const cid = props['CID'] as number;
    const smiles = props['CanonicalSMILES'] as string | undefined;

    // Fetch synonyms
    let synonyms: string[] = [];
    try {
      const synUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/synonyms/TXT`;
      const synResp = await fetch(synUrl);
      if (synResp.ok) {
        const text = await synResp.text();
        synonyms = text.split('\n').filter(Boolean).slice(0, 10);
      }
    } catch {
      // Synonyms are optional
    }

    return {
      cid,
      name,
      smiles,
      molecularFormula: props['MolecularFormula'] as string | undefined,
      molecularWeight: props['MolecularWeight'] as string | undefined,
      iupacName: props['IUPACName'] as string | undefined,
      synonyms,
      sourceUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
      source: 'pubchem',
    };
  } catch {
    return null;
  }
}

export async function lookupCompoundBySmiles(smiles: string): Promise<CompoundInfo | null> {
  try {
    const url = `${PUBCHEM_BASE}/compound/smiles/${encodeURIComponent(smiles)}/property/CanonicalSMILES,MolecularFormula,MolecularWeight,IUPACName/JSON`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data: PubChemPropertyResponse = await resp.json();
    const props = data.PropertyTable?.Properties?.[0];
    if (!props) return null;

    const cid = props['CID'] as number;

    // Fetch synonyms for the CID
    let synonyms: string[] = [];
    let name = `CID ${cid}`;
    try {
      const synUrl = `${PUBCHEM_BASE}/compound/cid/${cid}/synonyms/TXT`;
      const synResp = await fetch(synUrl);
      if (synResp.ok) {
        const text = await synResp.text();
        synonyms = text.split('\n').filter(Boolean).slice(0, 10);
        if (synonyms.length > 0) name = synonyms[0];
      }
    } catch {
      // Optional
    }

    return {
      cid,
      name,
      smiles: props['CanonicalSMILES'] as string | undefined,
      molecularFormula: props['MolecularFormula'] as string | undefined,
      molecularWeight: props['MolecularWeight'] as string | undefined,
      iupacName: props['IUPACName'] as string | undefined,
      synonyms,
      sourceUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
      source: 'pubchem',
    };
  } catch {
    return null;
  }
}

export function validateSmiles(smiles: string): { valid: boolean; message: string } {
  if (!smiles || !smiles.trim()) {
    return { valid: false, message: 'Please enter a SMILES string.' };
  }
  const trimmed = smiles.trim();
  // Basic SMILES validation: only allow valid SMILES characters
  const validChars = /^[A-Za-z0-9@[()\].=#\-+/:!?@$,%~&*]+$/;
  if (!validChars.test(trimmed)) {
    return { valid: false, message: 'SMILES contains invalid characters.' };
  }
  const open = (trimmed.match(/[[({]/g) || []).length;
  const close = (trimmed.match(/[)\]}]/g) || []).length;
  if (open !== close) {
    return { valid: false, message: 'Unbalanced brackets in SMILES string.' };
  }
  return { valid: true, message: 'SMILES format appears valid.' };
}
