using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using toolbox = btmc.src.ui.resources.toolbox; // Alias for easy reference

namespace btmc.src.ui.forms.main.components
{
    public partial class Clear : toolbox.CButton.CustomButton
    {
        public Clear()
        {
            InitializeComponent();
        }

        public static void ClearInputs(ref TextBox[] inputs)
        {
            foreach (TextBox input in inputs)
            {
                // Try cast to CustomTextBox
                var custom = input as toolbox.CTextBox.CustomTextBox;
                var placeholder = custom?.Placeholder ?? string.Empty;

                // Clear only if not empty and not placeholder
                if (!string.IsNullOrWhiteSpace(input.Text) && input.Text != placeholder)
                {
                    input.Text = string.Empty;
                }

                // Reapply placeholder if needed
                if (string.IsNullOrWhiteSpace(input.Text))
                {
                    input.Text = placeholder;
                    input.Foreground = Brushes.Gray;
                }
            }
        }
    }
}
