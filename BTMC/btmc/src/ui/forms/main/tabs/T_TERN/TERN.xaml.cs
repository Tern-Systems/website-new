using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Threading;

using btmc.src.alu;
using btmc.src.ui.forms.main.components;

namespace btmc.src.ui.forms.main.tabs.T_TERN
{
    using OperationEntry = KeyValuePair<ALU.Operation, string>;

    public partial class TERN : UserControl
    {
        
        public Utils.TypePatternEntry TextBoxPattern { get; }

        public List<OperationEntry> Operations { get; } = ALU.Operations?.ToList() ?? new();

        public List<string> operations =>
            new[] { "Select..." }.Concat(Operations.Select(op => op.Value)).ToList();


        public TERN()
        {
            InitializeComponent();
            DataContext = this; // Enables binding in XAML to this class’s properties
        }

        private void BtnSwap_Click(object sender, RoutedEventArgs e)
        {
            Swap.SwapInputs(input1, input2);
        }

        private bool _hasFocusBeenCleared = false;

        // Prevent automatic unwanted focus on tab switch
        private void TERN_IsVisibleChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            if (IsVisible && !_hasFocusBeenCleared)
            {
                _hasFocusBeenCleared = true;

                Dispatcher.BeginInvoke(new Action(() =>
                {
                    Keyboard.ClearFocus();
                    FocusManager.SetFocusedElement(FocusManager.GetFocusScope(this), this);
                }), DispatcherPriority.Input);
            }
        }
    }
}
