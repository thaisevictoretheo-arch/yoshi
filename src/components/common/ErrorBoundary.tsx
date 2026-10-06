import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Yoshi Uncaught Error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#050507] text-[#FFFFFF] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF2F87]/15 border border-[#FF2F87]/30 text-[#FF2F87] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">Ops, algo deu errado</h2>
            <p className="text-xs text-[#B8B8C7] leading-relaxed">
              Ocorreu uma falha inesperada na interface. Os seus dados e projetos salvos continuam intactos.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] hover:from-[#FF4FA0] hover:to-[#FF2F87] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#FF2F87]/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recarregar Sistema</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
